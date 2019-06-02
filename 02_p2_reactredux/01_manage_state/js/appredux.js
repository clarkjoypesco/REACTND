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

// function app(state = {}, action) {
//   return {
//     todos: todos(state.todos, action),
//     goals: goals(state.goals, action)
//   };
// }

// function checkAndDispatch(store, action) {
//   if (
//     action.type === ACTIONS.ADD_TODO &&
//     action.todo.name.toLowerCase().includes("bitcoin")
//   ) {
//     return alert(`Nope, That's a bad idea.`);
//   }
//   if (
//     action.type === ACTIONS.ADD_GOAL &&
//     action.goal.name.toLowerCase().includes("bitcoin")
//   ) {
//     return alert(`Nope, That's a bad idea.`);
//   }

//   return store.dispatch(action);
// }

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

store.subscribe(() => {
  const { goals, todos } = store.getState();

  document.getElementById("goals").innerHTML = "";
  document.getElementById("todos").innerHTML = "";
  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
});

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

function addTodo() {
  const input = document.getElementById("todo");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      name,
      complete: false,
      id: generateId()
    })
  );
}

function addGoal() {
  const input = document.getElementById("goal");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name
    })
  );
}

//Add Listener to UI
document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);

function createRemoveButton(onClick) {
  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "X";
  removeBtn.addEventListener("click", onClick);
  return removeBtn;
}

function addTodoToDOM(todo) {
  const node = document.createElement("li");
  const text = document.createTextNode(todo.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(removeBtn);
  document.getElementById("todos").appendChild(node);

  node.style.textDecoration = todo.complete ? " line-through" : "none";

  node.addEventListener("click", () => {
    store.dispatch(toggleTodoAction(todo.id));
  });
}
function addGoalToDOM(goal) {
  const node = document.createElement("li");
  const text = document.createTextNode(goal.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });
  node.appendChild(text);
  node.appendChild(removeBtn);
  document.getElementById("goals").appendChild(node);
}

// store.dispatch(
//   addTodoAction({
//     id: 0,
//     name: "Learn Redux",
//     complete: false
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 1,
//     name: "Learn React",
//     complete: false
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 2,
//     name: "Learn Python",
//     complete: false
//   })
// );

// store.dispatch(
//   addGoalAction({
//     id: 0,
//     name: "Lose 20 pounds"
//   })
// );

// store.dispatch(
//   addGoalAction({
//     id: 1,
//     name: "Walk to school"
//   })
// );

// store.dispatch(removeTodoAction(1));
