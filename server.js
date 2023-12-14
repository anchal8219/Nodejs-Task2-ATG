const { app } = require("./app");
const { connDB } = require("./config/db");

const PORT=4500;
app.listen(PORT,async()=>{
    await connDB();
    console.log("listen on port:", PORT)
})