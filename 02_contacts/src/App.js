import React from "react";

class ContactList extends React.Component {
  render() {
    const people = this.props.contacts;

    return (
      <ol>
        {people.map(person => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ol>
    );
  }
}

function App() {
  return (
    <div className="App">
      <ContactList
        contacts={[{ name: "Clark" }, { name: "Joy" }, { name: "Pesco" }]}
      />
      <ContactList
        contacts={[
          { name: "Amanda" },
          { name: "Katherine" },
          { name: "Brenda" }
        ]}
      />
    </div>
  );
}

export default App;
