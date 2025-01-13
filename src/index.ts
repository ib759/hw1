import {app} from "./settings";
import {runDb} from "../db/db";

const port = process.env.PORT || 3000 || 3999

app.listen(port,async () => {
    console.log(`App starts on port ${port}`)
    await runDb()
})


/*const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()*/