import express,{response} from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const app = express()
const port = process.env.PORT || 3000

const newspapers = [
    {
        name:"thetimes",
        address:"https://www.thetimes.co.uk/environment/climate-change",
  base:'', 
    },
    {
        name:"telegraph",
        address:"https://www.telegraph.co.uk/climate-change/",
 base:'https://www.telegraph.co.uk'    
    },
    {
        name:"guardian",
        address:"https://www.theguardian.com/environment/climate-crisis",
    }

]

const articles =[];

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then (response =>{
        const html =response.data;
        const $ =  cheerio.load(html);

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url =$(this).attr('href')
    articles.push({
        title,
        url :newspaper.base +url,
        source:newspaper.name
    })
        })
        res.json(articles)
        }).catch((err)=>console.log(err))
    })


app.get('/', (req, res) => {
 res.json(articles)
})
app.get('/news/:newspaperId',async(req,res)=>{
    const newspaperId=(req.params.newspaperId)
const newspaperbase= newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

const newspaperAddress =    newspapers.filter(newspaper=> newspaper.name == newspaperId)[0].address
axios.get(newspaperAddress)
.then(response =>{
    const html =response.data
    const $ =cheerio.load(html)
    const specificArticles =[]

    $('a:contains("climate")',html).each(function(){
        const title = $(this).text()
        const url =$(this).attr('href')
        specificArticles.push({
            title,
            url:newspaperbase+url,
            source:newspaperId
        })
})
res.json(specificArticles)
}).catch(err=> console.log(err))
})

app.listen(port, (req, res) => {
  console.log(`app is listening in  ${port}`)
})
