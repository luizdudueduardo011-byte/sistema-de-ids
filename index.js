const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// ==============================
// CONFIGURAÇÃO
// ==============================

// COLOQUE O TOKEN DO SEU BOT ENTRE AS ASPAS
client.login(process.env.DISCORD_TOKEN);

// Formato do apelido:
// Nome | 001
const SEPARADOR = ' | ';


// ==============================
// BANCO DE DADOS
// ==============================

const arquivoDados = path.join(__dirname, 'dados.json');

let dados;

if (fs.existsSync(arquivoDados)) {
    dados = JSON.parse(fs.readFileSync(arquivoDados, 'utf8'));
} else {
    dados = {
        proximoId: 1
    };

    fs.writeFileSync(
        arquivoDados,
        JSON.stringify(dados, null, 2)
    );
}


// ==============================
// BOT
// ==============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});


// Quando o bot ligar
client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
    console.log(`Próximo ID: ${String(dados.proximoId).padStart(3, '0')}`);
});


// Quando uma pessoa entrar
client.on('guildMemberAdd', async (member) => {

    // Não numerar outros bots
    if (member.user.bot) return;

    // Pega o ID atual
    const id = dados.proximoId;

    // Já reserva o próximo número
    dados.proximoId++;

    // Salva imediatamente
    fs.writeFileSync(
        arquivoDados,
        JSON.stringify(dados, null, 2)
    );

    // 001, 002, 003...
    const numero = String(id).padStart(3, '0');

    // Nome da pessoa
    let nome = member.displayName;

    // O Discord limita o apelido a 32 caracteres
    const apelido = `${nome}${SEPARADOR}${numero}`;
    const apelidoFinal = apelido.substring(0, 32);

    try {
        await member.setNickname(apelidoFinal);

        console.log(
            `${member.user.tag} recebeu o ID ${numero}`
        );

    } catch (erro) {
        console.log(
            `Não consegui mudar o apelido de ${member.user.tag}.`
        );
        console.log(erro.message);
    }
});


// ==============================
// LIGAR O BOT
// ==============================

client.login(TOKEN);
