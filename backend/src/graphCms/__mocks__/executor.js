const schema = require('./schema');
const { graphql } = require('graphql');
const { print } =require('graphql/language/printer');

const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
const contextMock = {jwtSign}


module.exports = async ({ document, variables }) => {
    const mockedSchema = await schema();
    const query = print(document);

        const tokens = query.split('!')
        const vars = Object.values(variables);
        let filledQuery = [];
        let max = tokens.length - 1;
        for(let i = 0; i < tokens.length; i++){
            if(max-- > 0){
                filledQuery.push(tokens[i]+`="` +vars[i]+`"`);
            }else {
                filledQuery.push(tokens[i]);
            }
        }
        filledQuery=filledQuery.join(' ');
    
    return (await graphql( mockedSchema, filledQuery, contextMock))
};