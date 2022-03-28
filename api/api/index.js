const method    = require('../methods/validation')
const db        = require('../db/db')
const bcrypt    = require('bcrypt')
const express   = require('express')
const server    = express.Router()

const cryptograph = password =>{
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password,salt)
}


server.route('/api/v1/users').get(async(req,res)=>{
    return await db.select(['id','email','senha'])
            .from('usuario')
            .then(response => res.status(200).json(response))
            .catch(_ => res.status(500).send('Ocorreu um erro no servidor.'))
}).post(async(req, res)=>{
    const USERS = {  ...req.body  }

    try{
            method(USERS.email, 'Email não informado.')
            method(USERS.senha, 'senha não informada.')
    }catch(_){
        return res.status(500).send('Ocorreu um erro no servidor.')
    }

    USERS.senha = cryptograph(USERS.senha)

   await db.insert(USERS)
           .from('usuario')
           .then(_ =>  res.status(201).send('Usuário criado com sucesso.'))
           .catch(_ => res.status(400).send('Erro ao inserir os dados.'))
}).delete(async(req,res)=>{
    await db.delete()
            .table('usuario')
            .then(_ => res.status(204).send('Dados removidos com Sucesso.'))  
            .catch(_ => res.status(500).send('Ocorreu um erro no servidor.'))
})


server.route('/api/v1/users/:id').get(async(req,res)=>{
    const USERS = { ...req.params }

    const searchUser = await db.where({ id: USERS.id })
                               .table('usuario')
                               .first()
    if(!searchUser) return res.status(404).send('Usuário não encontrado.')

    if(searchUser){
     await db.where({id: USERS.id})
             .select(['id','email','senha'])
             .from('usuario')
             .then(response => res.status(200).json(response))
             .catch(_     => res.status(500).send('Ocorreu um erro no servidor.'))
    }
}).delete(async(req,res)=>{
    const USERS = { ...req.params }

    const searchUser = await db.where({ id: USERS.id })
                               .table('usuario')
                               .first()
    if(!searchUser) return res.status(404).send('Usuário não encontrado.')

    if(searchUser){
      await db.where({id: USERS.id})
            .delete()
            .from('usuario')
            .then(_ => res.status(204).json())
            .catch(err => res.status(404).send(err))
    }
    
}).put(async(req,res)=>{
    const USERS   = {  ...req.body   }

    const searchUser = await db.where({ email: USERS.email })
                               .andWhere('id',req.params.id)
                               .table('usuario')
                               .first()

    if(!searchUser) return res.status(404)
                              .send('Usuário não encontrado.')
    
    if(searchUser){
            try{
                method(USERS.senha, 'Senha não informada.')
        }catch(err){
            return res.status(400)
                      .send(err)
        }

        USERS.senha = cryptograph(USERS.senha)

      await db.where({id: req.params.id})
            .update(USERS)
            .from('usuario')
            .then(_ => res.status(201).send('Usuário alterado com sucesso.'))
            .catch(_ => res.status(500).send('Ocorreu um erro no servidor.'))
    }
   
})


module.exports = server