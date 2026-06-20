const {open} = require('sqlite') 
const sqlite3 = require('sqlite3') 
const path = require('path') 

const express = require('express') 
const app = express() 
app.use(express.json()) 

const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 

let db = null; 
const dbpath = path.join(__dirname, "covid19India.db") 

const initializerDBAndServer = async () => { 
  
    try{
       db = await open({
        filename: dbpath, 
        driver: sqlite3.Database
    })

    app.listen(4000, () =>{
        console.log('server is running at: http://localhost:4000')
    })

    }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }

}

initializerDBAndServer()  


// authentication // 

const authentication =  (request, response, next) => { 
    let jwtToken;
    const authheaders = request.headers['authorization'] 

    if(authheaders !== undefined){
        jwtToken = authheaders.split(' ')[1]

    }

    if(jwtToken === undefined){
        response.status(400) 
        response.send("Invalid jwtToken")
    }else{
        jwt.verify(jwtToken, 'mahi', async (error, payload) => {
            if (error){
                  response.status(400) 
                 response.send("Invalid jwtToken")
            }else{
                next()
            }
        })
    }

}

// register  user//
app.get('/register/', async (request, response) => {
    const {username, password} = request.body; 
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(password.length)
    const query = ` 
    SELECT * FROM user WHERE username = '${username}'; 
    `
    const dbUser = await db.get(query) 
    
    if(dbUser === undefined){
         if(password.length > 5){
            response.status(400)
            response.send("Password is too Short")
         }else{
            const query = ` 
            INSERT INTO user(username, password) 
            VALUES('${username}', '${hashedPassword}');` 
            const createUser = await db.run(query) 
            response.send("User Created Successfully")
         }
    }else{
        response.status(401) 
        response.send("User Already Exists")
    }
    
})

 // login user // 
app.get('/login/', async (request, response) => {
     const {username, password} = request.body; 
      const query = ` 
    SELECT * FROM user WHERE username = '${username}';` 
    
     const dbUser = await db.get(query) 

     if(dbUser === undefined){
            response.status(401) 
           response.send("Invalid User")

     }else{
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password) 

        if(isPasswordMatched === true){
             const payload = {username: username} 
             const jwtToken = jwt.sign(payload, 'mahi') 
             response.send({jwtToken})

        }else{
            response.status(400) 
           response.send("Invalid Password")
        }
    }
})

// api-2 //
app.get('/states/', authentication, async (request, response) => {
    const query = `SELECT * FROM state;` 
    const getStateList = await db.all(query) 
    response.send(getStateList)
})

// api-3 //
app.get('/states/:stateId/', authentication, async (request, response) => {
    const {stateId} = request.params
    const query = `SELECT * FROM state WHERE state_id = '${stateId}';` 
    const getStateList = await db.get(query) 
    response.send(getStateList)
})

// api-4 //
app.get('/districts/', authentication, async (request, response) => {
    const query = `SELECT * FROM district;` 
    const getStateList = await db.all(query) 
    response.send(getStateList)
})

// api-5 // 
app.get('/districts/:districtId/', authentication, async (request, response) => {
    const {districtId} = request.params
    const query = `SELECT * FROM district WHERE district_id = '${districtId}';` 
    const getStateList = await db.get(query) 
    response.send(getStateList)
})

// api-6 //

app.delete('/districts/:districtId/', authentication, async (request, response) => {
    const {districtId} = request.params
    const query = `DELETE  FROM district WHERE district_id = '${districtId}';` 
    const getStateList = await db.run(query) 
    response.send("Todo Delted Succesfully")
})


 
// api-7 //
app.put(
  '/districts/:districtId/',
  authentication,
  async (request, response) => {
    const {districtId} = request.params
    const {districtName, stateId, cases, cured, active, deaths} = request.body
    const updateDistrictQuery = `
   UPDATE  
  district SET 
  district_name = "${districtName}", 
  state_id = "${stateId}",
  cases =  "${cases}",
  cured = "${cured}",
  active = "${active}",
  deaths = "${deaths}"
  WHERE 
  district_id = ${districtId}
  `
    await db.run(updateDistrictQuery)
    response.send('District Details Updated')
  },
)

// api-8 //
app.get(
  '/states/:stateId/stats/',
  authentication,
  async (request, response) => {
    const {stateId} = request.params
    const getStateCasesQuery = ` 
  SELECT 
  SUM(district.cases) AS totalCases, 
  SUM(district.cured) AS totalCured,
  SUM(district.active) AS totalActive,
  SUM(district.deaths) AS totalDeaths 
  FROM 
  state 
  JOIN district ON 
  state.state_id = district.state_id 
  WHERE 
   state.state_id = ${stateId};
  `
    const getStateCases = await db.get(getStateCasesQuery)
    response.send(getStateCases)
  },
)


