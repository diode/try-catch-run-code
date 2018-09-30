/**
 * @author diode / http://vipin.live/
 */

 /* Javascript code merged into one file */

// Comment.js
// Comment Component
class Comment extends React.Component {
  render() {

    // `read comment object from props`
    let comment = this.props.comment,

        name = comment.from.name,
        message = comment.message,
        date = new Date(comment.created_time),
        dateString = [date.getMonth() + 1,
                      date.getDate(),
                      date.getFullYear()].join("/"),
        timeString = [date.getHours(),
                      date.getMinutes(),
                      date.getSeconds()].join(":");

    let actions = comment.actions;

    // use the variables in html templaet below
    return (
      <div className="comment">
        <label className="name"> Name : {name}</label>
        <label className="time">On {dateString} at {timeString}</label>
        <p>{message}</p>
        <ul className="actions">
          {actions.map((action)=>
            <li>
              <a href="#">{action.name}</a>
            </li>
          )}
        </ul>
      </div>
    );

  }
}



// App.js
// App Component
class App extends React.Component {
  render() {
    // pass each `comment` in `this.props.comments`
    // and render `Comment` component
    return (
      <div className="App">
        {/* show name */}
        <h3>{this.props.name}</h3>
        <ul className="comments">
          {/* map is used for iterating comments */}
          {this.props.comments.map((comment) =>
            <li>
              <Comment comment={comment}/>
            </li>
          )}
        </ul>
      </div>
    );
  }
}



// Index.js
// hard coded sample data
var data = {
   "name" : "Comments",
   "comments": [{
         "from": {
            "name": "Tom Brady", "id": "X12"
         },
         "message": "Looking forward to 2010!",
         "actions": [{
               "name": "Comment",
               "link": "http://www.facebook.com/X999/posts/Y999"
            }, {
               "name": "Like",
               "link": "http://www.facebook.com/X999/posts/Y999"
            }
         ],
         "created_time": "2010-08-02T21:27:44+0000",
      }, {
         "from": {
            "name": "Peyton Manning", "id": "X18"
         },
         "message": "Where's my contract?",
         "actions": [{
               "name": "Comment",
               "link": "http://www.facebook.com/X998/posts/Y998"
            },{
               "name": "Like",
               "link": "http://www.facebook.com/X998/posts/Y998"
            }
         ],
         "created_time": "2010-08-02T21:27:44+0000",
      }
   ]
}

// render `App` component
// pass `data.name` and `data.comments` to `App` component
ReactDOM.render(
  <App name={data.name} comments={data.comments}/>,
  document.getElementById('root')
);
