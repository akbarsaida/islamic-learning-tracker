import { useState,useEffect } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell } from "recharts"

type Task={
id:number
name:string
progress:number
}

type Habit={
name:string
done:boolean
}

const COLORS=["#22c55e","#3b82f6","#a855f7","#f97316"]

const weekDays=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

export default function App(){

const [dark,setDark]=useState(false)

const [tasks,setTasks]=useState<Task[]>([])
const [newTask,setNewTask]=useState("")

const [calendarDays,setCalendarDays]=useState<number[]>(Array(365).fill(0))

const [xp,setXp]=useState(0)
const [streak,setStreak]=useState(0)

const [habits,setHabits]=useState<Habit[]>([
{name:"Quran",done:false},
{name:"Hadits",done:false},
{name:"Tafsir",done:false},
{name:"Fiqh",done:false}
])

const today=new Date().getDate()

/* LOAD STORAGE */

useEffect(()=>{

const savedTasks=localStorage.getItem("tracker_tasks")
const savedCalendar=localStorage.getItem("tracker_calendar")
const savedHabits=localStorage.getItem("tracker_habits")

if(savedTasks)setTasks(JSON.parse(savedTasks))
if(savedCalendar)setCalendarDays(JSON.parse(savedCalendar))
if(savedHabits)setHabits(JSON.parse(savedHabits))

},[])

/* SAVE STORAGE */

useEffect(()=>{
localStorage.setItem("tracker_tasks",JSON.stringify(tasks))
localStorage.setItem("tracker_calendar",JSON.stringify(calendarDays))
localStorage.setItem("tracker_habits",JSON.stringify(habits))
},[tasks,calendarDays,habits])

/* XP */

useEffect(()=>{
const total=tasks.reduce((sum,t)=>sum+t.progress,0)
setXp(total)
},[tasks])

/* LEVEL */

const level=Math.floor(xp/100)+1

/* STREAK */

useEffect(()=>{

let s=0
for(let i=calendarDays.length-1;i>=0;i--){
if(calendarDays[i]>0)s++
else break
}

setStreak(s)

},[calendarDays])

/* TASK FUNCTIONS */

const addTask=()=>{
if(!newTask)return
setTasks([...tasks,{id:Date.now(),name:newTask,progress:0}])
setNewTask("")
}

const deleteTask=(id:number)=>{
setTasks(tasks.filter(t=>t.id!==id))
}

const addProgress=(id:number)=>{
setTasks(tasks.map(t=>
t.id===id
?{...t,progress:Math.min(t.progress+10,100)}
:t
))
}

/* CALENDAR */

const toggleDay=(index:number)=>{
const updated=[...calendarDays]
updated[index]=(updated[index]+1)%4
setCalendarDays(updated)
}

/* HABITS */

const toggleHabit=(i:number)=>{
const updated=[...habits]
updated[i].done=!updated[i].done
setHabits(updated)
}

/* CHART DATA */

const chartData=tasks.map(t=>({
name:t.name,
progress:t.progress
}))

const pieData=[
{ name:"Completed", value:tasks.filter(t=>t.progress===100).length },
{ name:"Remaining", value:tasks.filter(t=>t.progress<100).length }
]

const showAchievement=xp>=100

return(

<div className={dark
?"bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 min-h-screen"
:"bg-gray-100 min-h-screen"}>

<div className={`max-w-6xl mx-auto p-6 rounded-2xl shadow-lg backdrop-blur
${dark?"bg-gray-800/70":"bg-white"}`}>

{/* HEADER */}

<div className="flex justify-between mb-6">

<div>
<h1 className="text-3xl font-bold">
Islamic Learning Tracker PRO
</h1>

<p className="text-sm opacity-70">
Track your journey of knowledge
</p>
</div>

<button
onClick={()=>setDark(!dark)}
className="text-2xl"
>
{dark?"🌞":"🌙"}
</button>

</div>

{/* DASHBOARD */}

<div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-10">

<div className="bg-green-500 p-6 rounded text-white hover:scale-105 transition">
<p>Total Targets</p>
<h2 className="text-3xl font-bold">{tasks.length}</h2>
</div>

<div className="bg-blue-500 p-6 rounded text-white hover:scale-105 transition">
<p>Level</p>
<h2 className="text-3xl font-bold">{level}</h2>
</div>

<div className="bg-purple-500 p-6 rounded text-white hover:scale-105 transition">
<p>XP</p>
<h2 className="text-3xl font-bold">{xp}</h2>
</div>

<div className="bg-orange-500 p-6 rounded text-white hover:scale-105 transition">
<p>🔥 Streak</p>
<h2 className="text-3xl font-bold">{streak} days</h2>
</div>

</div>

{/* CALENDAR */}

<h2 className="font-bold mb-3">Learning Calendar</h2>

<div className="grid grid-cols-7 text-center text-xs font-semibold mb-2">
{weekDays.map(day=>(<div key={day}>{day}</div>))}
</div>

<div className="grid grid-cols-7 gap-2 max-h-96 overflow-y-scroll pr-2 mb-4">

{calendarDays.map((d,i)=>(

<div
key={i}
onClick={()=>toggleDay(i)}
className={`h-10 rounded cursor-pointer flex items-center justify-center text-xs font-bold transition hover:scale-105 hover:shadow

${d===0?(dark?"bg-gray-700":"bg-gray-200"):
d===1?"bg-emerald-200":
d===2?"bg-emerald-400":
"bg-emerald-600 text-white"}

${i+1===today?" ring-2 ring-blue-500":""}

`}
>

{i+1}

</div>

))}

</div>

{/* LEGEND */}

<div className="flex items-center gap-2 text-xs mb-10">

<span>Less</span>

<div className="w-4 h-4 bg-gray-200 rounded"></div>
<div className="w-4 h-4 bg-emerald-200 rounded"></div>
<div className="w-4 h-4 bg-emerald-400 rounded"></div>
<div className="w-4 h-4 bg-emerald-600 rounded"></div>

<span>More</span>

</div>

{/* HABITS */}

<h2 className="font-bold mb-3">Daily Habits</h2>

<div className="grid grid-cols-4 gap-4 mb-10">

{habits.map((h,i)=>(

<div
key={i}
onClick={()=>toggleHabit(i)}
className={`p-4 rounded cursor-pointer text-center font-semibold transition hover:scale-105

${h.done?"bg-green-400":"bg-gray-200"}

`}
>

{h.name}

</div>

))}

</div>

{/* CHARTS */}

<div className="grid md:grid-cols-2 gap-10 mb-10">

<BarChart width={350} height={250} data={chartData}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="progress" fill="#22c55e"/>
</BarChart>

<PieChart width={350} height={250}>
<Pie data={pieData} dataKey="value">
{pieData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index%COLORS.length]}/>
))}
</Pie>
</PieChart>

</div>

{/* ADD TASK */}

<div className="flex gap-3 mb-6">

<input
value={newTask}
onChange={e=>setNewTask(e.target.value)}
placeholder="Add learning target..."
className="flex-1 p-3 rounded border"
/>

<button
onClick={addTask}
className="bg-green-500 text-white px-6 rounded"
>
+ Add
</button>

</div>

{/* TASKS */}

<div className="grid md:grid-cols-2 gap-4">

{tasks.map(task=>(

<div key={task.id} className="p-4 bg-gray-200 rounded">

<div className="flex justify-between mb-2">

<p className="font-semibold">{task.name}</p>

<button
onClick={()=>deleteTask(task.id)}
className="text-red-500"
>
🗑
</button>

</div>

<div className="w-full bg-gray-300 h-3 rounded mb-2">

<div
style={{width:`${task.progress}%`}}
className="bg-green-500 h-3 rounded"
/>

</div>

<p className="text-xs mb-2">{task.progress}%</p>

<button
onClick={()=>addProgress(task.id)}
className="text-sm bg-green-500 text-white px-3 py-1 rounded"
>
+10 Progress
</button>

</div>

))}

</div>

</div>

{/* ACHIEVEMENT */}

{showAchievement && (

<div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg animate-bounce">

🏆 Achievement Unlocked! 100 XP

</div>

)}

</div>

)

}