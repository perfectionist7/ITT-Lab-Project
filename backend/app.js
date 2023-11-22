var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require('mysql');
var cors = require('cors');
var port = 3001

//Connection Info
var con = mysql.createConnection({
  host: 'localhost',
  user: 'ayush',
  password: 'Ayush@1404',
  database: 'HospitalManagement',
  multipleStatements: true
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Signup, Login, Password Reset Related Queries

//Checks if patient exists in database
app.get('/checkIfPatientExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM PatientInfo WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Creates User Account
app.get('/makeAccount', (req, res) => {
  console.log('Request received for /makeAccount');
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  let medications = query.medications;
  let conditions = query.conditions;
  let surgeries = query.surgeries;
  if(medications===undefined){
    medications="none"
  }
  if(conditions===undefined){
    conditions="none"
  }
  if(surgeries===undefined){
    surgeries="none"
  }
  let sql_statement = `CALL InsertPatientInfo` + `("${email}", "${password}", "${name}", "${address}", "${gender}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who="pat";
      return res.json({
        data: results
      })
    };
  });
  sql_statement='SELECT id FROM HealthRecord ORDER BY id DESC LIMIT 1;';
  console.log(sql_statement)
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      let sql_statement = `INSERT INTO HealthRecord (id, date, conditions, surgeries, medication) 
      VALUES ` + `("${generated_id}", curdate(), "${conditions}", "${surgeries}", "${medications}")`;
      console.log(sql_statement);
      con.query(sql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
          let sql_statement = `INSERT INTO PatientRecords (email, id) 
          VALUES ` + `("${email}",${generated_id})`;
          console.log(sql_statement);
          con.query(sql_statement, function (error, results, fields) {
            if (error) throw error;
            else {};
          });
        };
      });
    };
  });
});

//Checks If Doctor Exists
app.get('/checkIfDocExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM DoctorInfo WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Makes Doctor Account
app.get('/makeDocAccount', (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let sql_statement = `INSERT INTO DoctorInfo (email, gender, password, name) 
                       VALUES ` + `("${email}", "${gender}", "${password}", "${name}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_statement = `INSERT INTO DoctorSchedule (id, email) 
                       VALUES ` + `(${schedule}, "${email}")`;
      console.log(sql_statement);
      con.query(sql_statement, function(error){
        if (error) throw error;
      })
      email_in_use = email;
      password_in_use = password;
      who = 'doc';
      return res.json({
        data: results
      })
    };
  });
});

//Checks if patient is logged in
app.get('/checklogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM PatientInfo 
                       WHERE email="${email}" 
                       AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = email;
        password_in_use = password;
        who = "pat";
      }
      return res.json({
        data: results
      })
    };
  });
});

//Checks if doctor is logged in
app.get('/checkDoclogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * 
                       FROM DoctorInfo
                       WHERE email="${email}" AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = json[0].email;
        password_in_use = json[0].password;
        who="doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      return res.json({
        data: results
      })
    };
  });
});

//Resets Patient Password
app.post('/resetPasswordPatient', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `CALL UpdatePatientPassword` + `("${email}", "${oldPassword}", "${newPassword}")`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Resets Doctor Password
app.post('/resetPasswordDoctor', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `CALL UpdateDoctorPassword` + `("${email}", "${oldPassword}", "${newPassword}")`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Returns Who is Logged in
app.get('/userInSession', (req, res) => {
  return res.json({ email: `${email_in_use}`, who:`${who}`});
});

//Logs the person out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});

//Appointment Related

// Checks If a similar appointment exists to avoid a clash
app.get('/checkIfApptExists', (req, res) => {
  let cond1, cond2, cond3 = "";
  let params = req.query;
  let email = params.email;
  let doc_email = params.docEmail;
  let startTime = params.startTime;
  let date = params.date;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${startTime}', TIME)`;
  let statement = `SELECT * FROM PatientAppointments a, AppointmentSchedule b
  WHERE a.email = "${email}" AND
  a.id = b.id AND
  b.date = ${sql_date} AND
  b.starttime = ${sql_start}`
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      cond1 = results;
      statement=`SELECT * FROM Diagnosis d INNER JOIN AppointmentSchedule a 
      ON d.id=a.id WHERE d.email="${doc_email}" AND a.date=${sql_date} AND a.status="NotDone" 
      AND ${sql_start} >= a.starttime AND ${sql_start} < a.endtime`
      console.log(statement)
      con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
          cond2 = results;
          statement = `SELECT email, starttime, endtime, breaktime, day FROM DoctorSchedule
          INNER JOIN DoctorAvailability ON DoctorSchedule.id=DoctorAvailability.id
          WHERE email="${doc_email}" AND 
          day=DAYNAME(${sql_date}) AND 
          (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`
          //not in doctor schedule
          console.log(statement)
          con.query(statement, function (error, results, fields) {
            if (error) throw error;
            else {
              if(results.length){
                results = []
              }
              else{
                results = [1]
              }
              return res.json({
                data: cond1.concat(cond2,results)
              })
            };
          });
        };
      });
    };
  });
  //doctor has appointment at the same time - Your start time has to be greater than all prev end times
});

// Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          date as theDate 
                   FROM AppointmentSchedule
                   WHERE id = "${id}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results
      })
    };
  });
});

//Patient Info Related

//to get all doctor names
app.get('/docInfo', (req, res) => {
  let statement = 'SELECT * FROM DoctorInfo';
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To return a particular patient history
app.get('/OneHistory', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT gender,name,PatientInfo.email,address,conditions,surgeries,medication
                    FROM PatientRecords,PatientInfo,HealthRecord
                    WHERE PatientRecords.id=HealthRecord.id
                    AND PatientRecords.email=PatientInfo.email AND PatientInfo.email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  })
});

// app.get('/MedHistView', (req, res) => {
//   let params = req.query;
//   let patientName = "'%" + params.name + "%'";
//   let secondParamTest = "" + params.variable;
//   let statement = `SELECT name AS 'Name',
//                     PatientRecords.id AS 'ID',
//                     PatientInfo.email FROM PatientInfo,PatientRecords
//                     WHERE PatientInfo.email = PatientRecords.email
//                     AND PatientInfo.email IN (SELECT p.email
//                       FROM PatientAppointments p
//                       JOIN Diagnosis d ON p.id = d.id
//                       WHERE d.email = "${email_in_use}")`;  
//   if (patientName != "''")
//     statement += " AND PatientInfo.name LIKE " + patientName
//   console.log(statement)
//   con.query(statement, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       return res.json({
//         data: results
//       })
//     };
//   });
// });

//To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  let params = req.query;
  let patientName = params.name || '';
  let statement = `CALL GetMedHistView("${email_in_use}", "${patientName}")`;
  console.log(statement);

  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results[0]
      })
    };
  });
});


//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientAppointments.id as ID,
                  PatientAppointments.email as user, 
                  PatientAppointments.concerns as theConcerns, 
                  PatientAppointments.symptoms as theSymptoms, 
                  AppointmentSchedule.date as theDate,
                  AppointmentSchedule.starttime as theStart,
                  AppointmentSchedule.endtime as theEnd,
                  AppointmentSchedule.status as status
                  FROM PatientAppointments, AppointmentSchedule
                  WHERE PatientAppointments.email = "${email}" AND
                  PatientAppointments.id = AppointmentSchedule.id`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
    let params = req.query;
    let email = params.email;
    let statement = "SELECT email FROM PatientRecords WHERE email = " + email;
    console.log(statement)
    con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
            return res.json({
                data: results
            })
        };
    });
});

//Adds to PatientsAttendAppointment Table
app.get('/addToPatientSeeAppt', (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let sql_try = `INSERT INTO PatientAppointments (email, id, concerns, symptoms) 
                 VALUES ("${email}", ${appt_id}, "${concerns}", "${symptoms}")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else{
      return res.json({
        data: results
      })
    }
  });

});

//Schedules Appointment
app.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${time}', TIME)`;
  //sql to turn string to sql time obj
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let sql_try = `INSERT INTO AppointmentSchedule (id, date, starttime, endtime, status) 
                 VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_try = `INSERT INTO Diagnosis (id, email, diagnosis, prescription) 
                 VALUES (${id}, "${doctor}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
      console.log(sql_try);
      con.query(sql_try, function (error, results, fields) {
        if (error) throw error;
        else{
          return res.json({
            data: results
          })
        }
      });
    }
  });
});

//Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  let statement = 'SELECT id FROM AppointmentSchedule  ORDER BY id DESC LIMIT 1;'
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    };
  });
});

//To fill diagnoses
// app.get('/diagnose', (req, res) => {
//   let params = req.query;
//   let id = params.id;
//   let diagnosis = params.diagnosis;
//   let prescription = params.prescription;
//   let statement = `UPDATE Diagnosis SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE id=${id};`;
//   console.log(statement)
//   con.query(statement, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       let statement = `UPDATE AppointmentSchedule SET status="Done" WHERE id=${id};`;
//       console.log(statement)
//       con.query(statement, function (error, results, fields){
//         if (error) throw error;
//       })
//     };
//   });
// });

app.get('/diagnose', (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;

  let sql = `CALL DiagnoseAppointment(${id}, '${diagnosis}', '${prescription}')`;
  console.log(sql);
  con.query(sql, function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      return res.json({
        message: 'Diagnosis updated successfully!'
      });
    }
  });
});

//To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnosis WHERE id=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
  FROM AppointmentSchedule a, PatientAppointments psa, PatientInfo p
  WHERE a.id = psa.id AND psa.email = p.email
  AND a.id IN (SELECT id FROM Diagnosis WHERE email="${email_in_use}")`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnosis WHERE id=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To Show all diagnosed appointments till now
app.get('/allDiagnoses', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =`SELECT date,email,concerns,symptoms,diagnosis,prescription FROM 
  AppointmentSchedule A INNER JOIN (SELECT * from PatientAppointments NATURAL JOIN Diagnosis 
  WHERE email=${email}) AS B ON A.id = B.id;`
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To delete appointment
app.get('/deleteAppt', (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM AppointmentSchedule WHERE id=${uid};`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      results = results[0].status
      if(results == "NotDone"){
        statement = `DELETE FROM AppointmentSchedule WHERE id=${uid};`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) throw error;
        });
      }
      else{
        if(who=="pat"){
          statement = `DELETE FROM PatientAppointments WHERE id = ${uid}`;
          console.log(statement);
          con.query(statement, function (error, results, fields) {
            if (error) throw error;
          });
        }
      }
    };
  });
  return;
});

// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;