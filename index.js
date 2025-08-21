const {useState, useEffect} = React;

const backend_link = "https://dev-habit-tracker.up.railway.app";
//-------------------------------------------LogForm----------------------------------------------------//
const LogForm = ()=>{
    const [username, setUsername] = useState("");
    const [categoryOfActivity, setCategoryOfActivity] = useState("");
    const [durationInMinutes, setDurationInMinutes] = useState();
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("green");

   const categories = ["Coding", "Development", "Practicing", "Other"];

    const handleSubmit = async (e)=>{
         e.preventDefault();
         try{
            const res = await fetch(`${backend_link}/user`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, categoryOfActivity, date: new Date().toISOString().split("T")[0], durationInMinutes, description})
            });
            const data = await res.json();
            if(res.ok){
               setMessage("Activity Saved Successfully");
               setUsername("");
               setDurationInMinutes('');
               setDescription("");
               setCategoryOfActivity("");
               setMessageColor("green");
            }
            else{
                setMessage(`Error in saving Activity`);
                setMessageColor('red');  
            }
         }  
         catch(err){
            setMessage(`Error in saving Activity`);
            setMessageColor('red');  
         }
    }
 
    const root = document.getElementById('root').style;
    root.display = "flex";
    root.flexDirection = "column";
    root.alignItems = "center";

    return (
    <div id="log-form">
      <form id="form" onSubmit={handleSubmit}>
        <div id="username-block">
          <label id="label-for-username" for="username">Username</label>
          <input class="input" id="username"  type="text"  placeholder="Enter Username"
          value={username}  onChange={e=>{setUsername(e.target.value)}}
          required
          />
        </div>
        <div id="category-block">
          <label id="label-for-category" for="category">Category</label>
          <select class="input" id="category" value={categoryOfActivity} onChange={e=>setCategoryOfActivity(e.target.value)}>
          <option value="">Select Category</option>
           { categories.map((cat, ind)=>(
              <option key={ind} value={cat}>{cat}</option>
           ))
           }
          </select>
        </div>
        <div id="duration-block">
          <label id="label-for-duration" for="duration">Duration ( in minutes )</label>
          <input class="input" id="duration" type="number" placeholder="20"
          value={durationInMinutes} onChange={e=>setDurationInMinutes(Number(e.target.value)===0? '' : Number(e.target.value))}
          required
          />
        </div>
        <div id="description-block">
          <label id="label-for-description" for="description">Description</label> 
          <textarea className="input" id="description" placeholder="Describe your activity..."
          value={description} onChange={e=>{setDescription(e.target.value)}}
          />
        </div>
        <div id="status-message" style={`color:${messageColor}`}>
          {message}
        </div>
        <button id="submit" type="submit" >Add Activity</button>
      </form>
    </div>
    )
}

//---------------------------------------LOgs -----------------------------------//

const Logs = ({setShowLogForm})=>{

    const [logs, setLogs] = useState([]);
    const [username, setUsername] = useState("");


    const fetchLogs = async (username)=>{

        try{
          const res = await fetch(`${backend_link}/user/logs?username=${username}`); 
          const data = await res.json().catch(()=>{});
          if(!res.ok){
             throw new Error(data.error || `HTTP: ${res.status}`);
          }                  
          data.sort();        
          setLogs(data);
          document.getElementById('listOfAllLogs').style.opacity = 1;
        }
        catch(err){
           console.log(`Error: ${err.message}`);
        }
    }

    const root = document.getElementById('root').style;
    root.display = "flex";
    root.flexDirection ="column";
    root.justifyContent = "center";
    

    return (
    <>
      <p id="message">Enter username to get track of your activities</p>
      <div id="logs-checker">
        <div id="logs-query">  
          <div id="logs-input">
            <label id="logs-username-label" for="logs-username-input">Username</label>
            <input id="logs-username-input" type="text" placeholder="Enter Username..." value={username} onChange={(e)=>{setUsername(e.target.value)}}
              onKeyDown={(e)=>{ if(e.key === " ") e.preventDefault();}}/>
          </div>
          <button id="search-btn" onClick={ () => fetchLogs(username) }>Search</button>
        </div>
        <button id="add-new-activity-btn" onClick={()=>setShowLogForm(true)}>Add new activity</button>
      </div>
     

      <div id="listOfAllLogs">
            <div id="heading-for-logs">
                <div className="username">Username</div>
                <div className="date">Date</div>
                <div className="category">Category</div>
                <div className="duration">Duration ( In Minutes )</div>
                <div className="description">Description</div>
            </div>
        {
            logs.map((el, ind)=>(
                <div className="log" key={ind}>
                    <div className="username">{el.username}</div>
                    <div className="date">{el.date}</div>
                    <div className="category">{el.categoryOfActivity}</div>
                    <div className="duration">{el.durationInMinutes}</div>
                    <div className="description">{el.description}</div>
                </div>
            ))
        }  
      </div>
    </> 
    );
}



const App = ()=>{
  const [showLogForm, setShowLogForm] = useState(true);
  return (<>
     <div id="title">Dev Habit Tracker</div>
    { 
         showLogForm ? (
           <>
             <LogForm />
             <button id="view-activity-btn" onClick={()=>setShowLogForm(false)}>View All Activities</button>
           </>
         ):(
        <>
          <Logs setShowLogForm={setShowLogForm}/>   
        </>
     )
    }
  </>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);