/**
 * @author diode / http://vipin.live/
 */

 /* Javascript code merged into one file */

// App.js
// App Component
class App extends React.Component {
  render() {
    return (
      <div className="App">
        {/* show name */}
        <label><span>Name </span>: {this.props.name}</label>
        {/* show age */}
        <label><span>Age </span>: {this.props.age}</label>
        {/* show place */}
        <label><span>Place </span>: {this.props.place}</label>
        <div>
          <label>Groups</label>
          {/* show groups */}
          <ul className="groups">
            {this.props.groups.map((group) =>
              <li>
                {group}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

// Index.js
// hard coded sample data
var data = {
   "name" : "Arun",
   "age"  : "28",
   "place" : "Kochi",
   "groups" : [
     "football",
     "basketball",
     "cricket"
   ]
}

// pass data properties to App component
ReactDOM.render(
  <App name={data.name} age={data.age} place={data.place} groups={data.groups}/>,
  document.getElementById('root')
)
