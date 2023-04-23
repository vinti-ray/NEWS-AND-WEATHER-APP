const newsModel=require("../model/newsModel")
const axios = require("axios");

//news Api key
const API_KEY = "f776177f5df64d55b927780ef28dff13";
const base_url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;


const newsLatest=async (req, res)=> {
    let keyword = req.params.keyword;

    //storing in dataBase =>ip address , number of api call  and the city name from user search
    let data = { ipAddress: req.socket.remoteAddress, count: 1,keyword:keyword };
    const findInDb= await newsModel.findOne({ipAddress:data.ipAddress}).lean()
    if(findInDb){
        findInDb.count=findInDb.count+1
        if(!findInDb.keyword.includes(keyword)){
             findInDb.keyword.push(keyword)
        }
        const updateData=await newsModel.findOneAndUpdate({ipAddress:data.ipAddress},{$set:findInDb},{new:true})
    }else{
     const createData=await newsModel.create(data)
    }

    //getting the news using axios get method
    axios
      .get(`${base_url}&q=${keyword}`)
      .then((response) => {
        const articles = response.data.articles;
        console.log(articles);
   
        if (articles.length == 0)
          return res.status(404).send({ message: "no news found" });
        let news = [];
  
  
        for (let i = 0; i < articles.length; i++) {
 
          let obj = {
            title: ` ${articles[i].title}`,
            description: articles[i].description,
            url: articles[i].url,
            image:articles[i].urlToImage
          };
  
          news.push(obj);
        }

    
        return res.status(200).send({status: true,message: `Showing top  results for "${keyword}"`,data: news});
    
    }).catch((error) => {
      return res.send({status:false,message:error.message})
      });


    }

    module.exports={newsLatest}
    