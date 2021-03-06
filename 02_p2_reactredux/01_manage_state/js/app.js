//Library code
function createStore(reducer) {
  //The store should have for parts
  // 1. The state
  // 2. Get the state
  // 3. Listen to changes on the state
  // 4. Update the state

  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const dispatch = action => {
    state = reducer(state, action);

    listeners.forEach(listener => listener());
  };

  return {
    getState,
    subscribe,
    dispatch
  };
}

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

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

const store = createStore(app);

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
