/**
 * @author diode / http://vipin.live/
 */

 /* Javascript code merged into one file */

// App.js
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="/resources/code/react/myreactapp/logo.svg" className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

// Index.js
ReactDOM.render(
  <h1> Hello World </h1>,
  document.getElementById('myApp')
);

ReactDOM.render(
  <App />,
  document.getElementById('myAppMain')
);
