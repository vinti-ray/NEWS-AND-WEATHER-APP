const axios = require("axios");
const weatherModel=require("../model/weatherModel")

const API_KEY = "a147f269127f39045c3bd15bf5d3c058";
const BASE_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;


const weatherReport=async (req, res) => {
  let city = req.params.city;


 //storing in dataBase =>ip address , number of api call  and keyword for news from user search
  let data = { ipAddress: req.socket.remoteAddress, count: 1,city:city };
  const findInDb= await weatherModel.findOne({ipAddress:data.ipAddress}).lean()
  if(findInDb){
      findInDb.count=findInDb.count+1
      if(!findInDb.city.includes(city)){
           findInDb.city.push(city)
      }
      const updateData=await weatherModel.findOneAndUpdate({ipAddress:data.ipAddress},{$set:findInDb},{new:true})
  }else{
   const createData=await weatherModel.create(data)
  }

//fetching weather report
  axios
    .get(`${BASE_URL}&q=${city}`)
    .then((response) => {
      const weather = response.data.weather[0];
      const main = response.data.main;
    //   console.log(response.data);
    let data={ 
        description:`The weather in ${city} is ${weather.description}`,
      temp:`${main.feels_like}°C`,
      feels_like:`${main.feels_like}°C`,
      humidity:`${main.humidity}%`,
      visibility:response.data.visibility
    }

      return res.status(200).send({status:true,data:data})

    })
    .catch((err) => {
      
      return res.send({status:false,message:err.message})

    });

   
}

module.exports={weatherReport}