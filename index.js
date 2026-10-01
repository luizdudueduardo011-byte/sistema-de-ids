const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const SEPARADOR = ' | ';

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

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
    console.log(`Próximo ID: ${String(dados.proximoId).padStart(3, '0')}`);
});

client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;

    const id = dados.proximoId;
    dados.proximoId++;

    fs.writeFileSync(
        arquivoDados,
        JSON.stringify(dados, null, 2)
    );

    const numero = String(id).padStart(3, '0');

    let nome = member.displayName;

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

client.login(process.env.DISCORD_TOKEN);
