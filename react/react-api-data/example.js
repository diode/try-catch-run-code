/**
 * @author diode / http://vipin.live/
 */

 /* Javascript code merged into one file */

// App.js
// App Component
class App extends React.Component {
  // Override constructor to set initial state
  constructor(props) {
    super(props);

    // set state
    this.state = {
      name : "",
      age : "",
      place : "",
      groups: []
    };
  }

  // callback invoked when component
  // is added
  componentDidMount() {
    var _this = this;
    if(this.props.store){
      // fetch data using axios
      axios.get(this.props.store.dataUrl)
      .then(function (response) {
        // set state using received data
        _this.setState(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <div className="App">
        {/* show title from props*/}
        <h4> {this.props.title} </h4>
        {/* show name from state */}
        <label><span>Name </span>: {this.state.name}</label>
        {/* show age from state */}
        <label><span>Age </span>: {this.state.age}</label>
        {/* show place from state */}
        <label><span>Place </span>: {this.state.place}</label>
        <div>
          <label>Groups</label>
          {/* show groups from state */}
          <ul className="groups">
            {this.state.groups.map((group) =>
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

// api info
var store = {
  dataUrl : "/apix/mockdata/member/info"
};

// static properties and store object
ReactDOM.render(
  <App title="Member Details" store={store}/>,
  document.getElementById('root')
)
