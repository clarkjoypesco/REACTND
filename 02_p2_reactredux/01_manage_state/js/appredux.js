//Dictionary Strings
const ACTIONS = {
  ADD_TODO: "ADD_TODO",
  REMOVE_TODO: "REMOVE_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  ADD_GOAL: "ADD_GOAL",
  REMOVE_GOAL: "REMOVE_GOAL"
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

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals
  }),
  Redux.applyMiddleware(checker, logger)
);

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}
