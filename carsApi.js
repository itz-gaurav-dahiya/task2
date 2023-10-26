let express =require('express');
let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type,Accept'
    );
    next();
});
// const port=2410;
var port =process.env.PORT || 2410
app.listen(port, ()=>console.log(`Node app listening on port ${port}!`));
let {carData,carMaster}=require('./carsData.js')
app.get('/svr/test',function(req,res){
    res.send('Test Response cars data');
});
app.get('/cars',function(req,res){
    let arr1=carData;
    let fuel=req.query.fuel;
    let type=req.query.type;
    let sort=req.query.sort;
    let minprice=req.query.minprice;
    let maxprice=req.query.maxprice;

    if (fuel) {
        let carfuel = carMaster.reduce((acc, curr) => {
            if (curr.fuel === fuel) {
                acc.push(curr.model);
            }
            return acc; // Return the accumulator in each iteration
        }, []);
        arr1 = arr1.filter((st) => (carfuel.includes(st.model)));
    }
    
    if (type) {
        let cartype = carMaster.reduce((acc, curr) => {
            if (curr.type === type) {
                acc.push(curr.model);
            }
            return acc; // Return the accumulator in each iteration
        }, []);
        arr1 = arr1.filter((st) => (cartype.includes(st.model)));
    }
    
    if(sort){
        if(sort=='kms'){
            arr1=arr1.sort((a,b)=>(a.kms-b.kms))
        }
        if(sort=='year'){
            arr1=arr1.sort((a,b)=>(a.year-b.year))
        }
        if(sort=='price'){
            arr1=arr1.sort((a,b)=>(a.price-b.price))
        }
    }
    if(minprice){
        arr1=arr1.filter((a)=>(a.price>minprice))
    }
    if(maxprice){
        arr1=arr1.filter((a)=>(a.price<maxprice))
    }
    res.send(arr1);
})
app.get('/cars/:id',function(req,res){
     let id=req.params.id
     if(id){
        let car=carData.find((c1)=>c1.id===id)
        res.send(car);
     }
     else{
        res.status(404).send('id not found')
     }
})
app.post('/cars',function(req,res){
    let body=req.body
    carData.push(body)
    res.send(body);
})
app.put('/cars/:id',function(req,res){
    let id=req.params.id;
    let body=req.body
    let ind=carData.findIndex((c1)=>c1.id===id)
    if(ind>=0){
        carData[ind]=body
        res.send(body)
    }
    else{
        res.status(404).send('data id not found')
    }
})
app.delete('/cars/:id',function(req,res){
    let id=req.params.id;
    let ind=carData.findIndex((st)=>st.id===id);
    if(ind>=0){
    let deletedata=carData.splice(ind,1);
        res.send(deletedata)
    }  
    else{
        res.status(404).send('no id found for delete')
    }
})