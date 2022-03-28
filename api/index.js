const _Port     = 8081
const Host      = '0.0.0.0'

const server    = require('./api/index')
const cors      = require('cors')
const log       = require('morgan')
const express   = require('express')

const app       = express()

app.use(log('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:'*',
              methods:['GET','PUT','POST','DELETE'],
              credentials:true
            }))

app.use('/', server)

app.listen(_Port, Host)

