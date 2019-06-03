//Dictionary Strings
const ACTIONS = {
  ADD_TODO: "ADD_TODO",
  REMOVE_TODO: "REMOVE_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  ADD_GOAL: "ADD_GOAL",
  REMOVE_GOAL: "REMOVE_GOAL",
  RECEIVE_DATA: "RECEIVE_DATA"
};

//Action Creators
function addTodoAction(todo) {
  return {
    type: ACTIONS.ADD_TODO,
    todo
  };
}

function removeTodoAction(id) {
  return {
    type: ACTIONS.REMOVE_TODO,
    id
  };
}
function toggleTodoAction(id) {
  return {
    type: ACTIONS.TOGGLE_TODO,
    id
  };
}

function addGoalAction(goal) {
  return {
    type: ACTIONS.ADD_GOAL,
    goal
  };
}
function removeGoalAction(id) {
  return {
    type: ACTIONS.REMOVE_GOAL,
    id
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: ACTIONS.RECEIVE_DATA,
    todos,
    goals
  };
}
function handleAddTodo(name, cb) {
  return dispatch => {
    return API.saveTodo(name)
      .then(todo => {
        dispatch(addTodoAction(todo));
        cb();
      })
      .catch(() => alert("There was an error. Try again!"));
  };
}
function handleDeleteTodo(todo) {
  return dispatch => {
    //Optimistic Updates
    dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo));
      alert("An error occured. Try again.");
    });
  };
}

function handleToggle(id) {
  return dispatch => {
    dispatch(toggleTodoAction(id));

    return API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodoAction(id));
      alert("An error occured. Try again.");
    });
  };
}

function handleAddGoal(name, cb) {
  return dispatch => {
    return API.saveGoal(name)
      .then(goal => {
        dispatch(addGoalAction(goal));
        cb();
      })
      .catch(() => alert("There was an error. Try again!"));
  };
}
function handleDeleteGoal(goal) {
  return dispatch => {
    dispatch(removeGoalAction(goal.id));

    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert("An error occured. Try again.");
    });
  };
}

function handleInitialData() {
  return dispatch => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
      ([todos, goals]) => {
        dispatch(receiveDataAction(todos, goals));
      }
    );
  };
}

// App Code
function todos(state = [], action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return state.concat([action.todo]);
    case ACTIONS.REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case ACTIONS.TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    case ACTIONS.RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ACTIONS.ADD_GOAL:
      return state.concat([action.goal]);

    case ACTIONS.REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    case ACTIONS.RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case ACTIONS.RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

const checker = store => next => action => {
  if (
    action.type === ACTIONS.ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert(`Nope, That's a bad idea.`);
  }
  if (
    action.type === ACTIONS.ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert(`Nope, That's a bad idea.`);
  }

  return next(action);
};

const logger = store => next => action => {
  console.group(action.type);
  console.log("The action:", action);
  const result = next(action);

  console.log("The new state: ", store.getState());

  console.groupEnd();

  return result;
};
//Custom thunk
// const thunk = (store) => (next) => (action) =>{

//   if(typeof action==='function'){

//     return action(store.dispatch)
//   }

//   return next(action)

// }

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(ReduxThunk.default, checker, logger)
);

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}
