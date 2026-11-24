//variaveis de inicialização
require("dotenv").config()
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// false (padrão) = MODO HÍBRIDO: o Arduino real grava na colmeia 1 (sensor 1)
//                  e o mock simula as colmeias 2-10 e o sensor externo (11).
// true           = tudo simulado (use quando o Arduino não estiver conectado).
const MODO_MOCK = false;
const ID_SENSOR_ARDUINO = 1;

// fabricantes de placas/chips USB-serial comuns (Arduino original e clones)
//   2341/2a03 = Arduino, 1a86 = CH340 (clones), 10c4 = CP210x, 0403 = FTDI
const VENDORS_ARDUINO = ['2341', '2a03', '1a86', '10c4', '0403'];
const INTERVALO_RECONEXAO = 3000; // tenta achar o Arduino de novo a cada 3 s se cair

// ---------------------------------------------------------------------
// perfis do MOCK (ids da tabela sensor: 1-10 internos, 11 externo)
// limites usados na dashboard (tabela configuracoes):
//   temperatura ideal 33-36 °C, risco < 32 ou > 38
//   umidade ideal 50-75 %,      risco < 40 ou >= 85
// cada sensor oscila devagar em volta do seu "alvo" e nunca sai da sua faixa ("min"/"max"),
// então a situação de cada colmeia fica estável: 5 ideais, 3 em atenção e 2 em risco.
// ---------------------------------------------------------------------
const PERFIS_MOCK = [
    { idSensor: 1,  situacao: 'Ideal',   temp: { alvo: 34.6, min: 33.4, max: 35.7 }, umid: { alvo: 62, min: 55, max: 70 } },
    { idSensor: 2,  situacao: 'Risco',   temp: { alvo: 39.3, min: 38.5, max: 40.4 }, umid: { alvo: 71, min: 66, max: 74 } }, // superaquecida
    { idSensor: 3,  situacao: 'Atenção', temp: { alvo: 36.8, min: 36.3, max: 37.5 }, umid: { alvo: 63, min: 57, max: 69 } }, // um pouco quente
    { idSensor: 4,  situacao: 'Risco',   temp: { alvo: 34.2, min: 33.4, max: 35.3 }, umid: { alvo: 88, min: 86, max: 92 } }, // umidade excessiva
    { idSensor: 5,  situacao: 'Ideal',   temp: { alvo: 34.1, min: 33.3, max: 35.2 }, umid: { alvo: 58, min: 52, max: 64 } },
    { idSensor: 6,  situacao: 'Atenção', temp: { alvo: 34.8, min: 33.6, max: 35.8 }, umid: { alvo: 79, min: 76, max: 83 } }, // úmida
    { idSensor: 7,  situacao: 'Ideal',   temp: { alvo: 35.3, min: 34.2, max: 35.9 }, umid: { alvo: 67, min: 60, max: 73 } },
    { idSensor: 8,  situacao: 'Atenção', temp: { alvo: 32.5, min: 32.2, max: 32.9 }, umid: { alvo: 55, min: 51, max: 60 } }, // um pouco fria
    { idSensor: 9,  situacao: 'Ideal',   temp: { alvo: 34.4, min: 33.4, max: 35.5 }, umid: { alvo: 54, min: 51, max: 60 } },
    { idSensor: 10, situacao: 'Ideal',   temp: { alvo: 35.0, min: 33.8, max: 35.9 }, umid: { alvo: 70, min: 63, max: 74 } },
    { idSensor: 11, situacao: 'Externo', temp: { alvo: 27.0, min: 14.0, max: 38.0 }, umid: { alvo: 68, min: 35, max: 95 } }
];
const ID_SENSOR_EXTERNO_MOCK = 11;

// estado atual de cada sensor (começa no alvo)
const estadoMock = {};
PERFIS_MOCK.forEach(p => estadoMock[p.idSensor] = { temp: p.temp.alvo, umid: p.umid.alvo });

// ambiente externo segue o horário do dia: mais quente e seco às 15h, mais frio e úmido de madrugada
function climaExterno(data) {
    const hora = data.getHours() + data.getMinutes() / 60;
    const ciclo = Math.cos((2 * Math.PI * (hora - 15)) / 24); // 1 às 15h, -1 às 3h
    return { temp: 24 + 5 * ciclo, umid: 70 - 15 * ciclo };
}

// passo de "passeio aleatório" puxando de volta para o alvo, preso na faixa do perfil
function proximoValor(atual, alvo, faixa, ruido) {
    const novo = atual + (alvo - atual) * 0.08 + (Math.random() - 0.5) * ruido;
    return Math.min(faixa.max, Math.max(faixa.min, novo));
}

function gerarLeiturasMock() {
    const externo = climaExterno(new Date());
    const variacaoExterna = externo.temp - 24; // colmeias sentem um pouco o calor de fora

    // no modo híbrido o sensor do Arduino não é simulado
    const perfis = MODO_MOCK ? PERFIS_MOCK : PERFIS_MOCK.filter(p => p.idSensor !== ID_SENSOR_ARDUINO);

    return perfis.map(p => {
        const estado = estadoMock[p.idSensor];
        if (p.idSensor === ID_SENSOR_EXTERNO_MOCK) {
            estado.temp = proximoValor(estado.temp, externo.temp, p.temp, 0.25);
            estado.umid = proximoValor(estado.umid, externo.umid, p.umid, 0.8);
        } else {
            estado.temp = proximoValor(estado.temp, p.temp.alvo + variacaoExterna * 0.06, p.temp, 0.18);
            estado.umid = proximoValor(estado.umid, p.umid.alvo, p.umid, 0.7);
        }
        return {
            idSensor: p.idSensor,
            temperatura: Number(estado.temp.toFixed(2)),
            umidade: Number(estado.umid.toFixed(1))
        };
    });
}

// função para simulação de dados (MOCK)
const serialMock = async (valoresSensorAnalogico, valoresSensorDigital) => {
    console.log(MODO_MOCK
        ? "--- MODO MOCK ATIVADO: simulando todos os sensores ---"
        : `--- MODO HÍBRIDO: Arduino real no sensor ${ID_SENSOR_ARDUINO}, mock nos demais ---`);

    const poolBancoDados = criarPool();

    setInterval(async () => {
        const leituras = gerarLeiturasMock();

        // o gráfico da própria API (index.html) mostra o sensor 1 (no híbrido quem alimenta é o Arduino)
        if (MODO_MOCK) {
            valoresSensorAnalogico.push(leituras[0].temperatura);
            valoresSensorDigital.push(leituras[0].umidade);
        }

        console.log("Mock Data ->", leituras.map(l => `S${l.idSensor}: ${l.temperatura}°C ${l.umidade}%`).join(" | "));

        // insere todas as leituras num único INSERT (mesmo dt_hora para todos os sensores)
        if (HABILITAR_OPERACAO_INSERIR) {
            try {
                const marcadores = leituras.map(() => '(?, ?, ?)').join(', ');
                const valores = leituras.flatMap(l => [l.umidade, l.temperatura, l.idSensor]);
                await poolBancoDados.execute(
                    `INSERT INTO coleta_dados (umidade, temperatura, fksensor) VALUES ${marcadores}`,
                    valores
                );
            } catch (err) {
                console.error("Erro ao inserir mock no banco:", err.message);
            }
        }
    }, 2000);
}

// conexão com o banco de dados MySQL
function criarPool() {
    return mysql.createPool(
        {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        }
    ).promise();
}

// procura a porta do Arduino (ARDUINO_PORTA no .env força uma porta, ex.: COM3)
async function encontrarPortaArduino() {
    if (process.env.ARDUINO_PORTA) return process.env.ARDUINO_PORTA;
    const portas = await serialport.SerialPort.list();
    const porta = portas.find((p) =>
        VENDORS_ARDUINO.includes(String(p.vendorId || '').toLowerCase()) ||
        /arduino|wch|ch340/i.test(p.manufacturer || '')
    );
    if (!porta) {
        const lista = portas.map(p => `${p.path} (${p.manufacturer || '?'} ${p.vendorId || ''})`).join(', ');
        throw new Error('Arduino não encontrado. Portas disponíveis: ' + (lista || 'nenhuma'));
    }
    return porta.path;
}

// "62.00; 34.50" -> { umidade: 62, temperatura: 34.5 }; linhas de erro do sketch viram null
function interpretarLinha(linha) {
    const partes = String(linha).split(';').map(v => v.trim());
    if (partes.length < 2) return null;
    const umidade = parseFloat(partes[0]);
    const temperatura = parseFloat(partes[1]);
    if (!Number.isFinite(umidade) || !Number.isFinite(temperatura)) return null;
    if (umidade < 0 || umidade > 100 || temperatura < -40 || temperatura > 80) return null;
    return { umidade, temperatura };
}

// guarda só as últimas leituras para o gráfico da própria API
function guardar(lista, valor) {
    lista.push(valor);
    if (lista.length > 100) lista.shift();
}

// função para comunicação serial real (grava no sensor ID_SENSOR_ARDUINO = colmeia 1)
// se o Arduino não for encontrado ou o cabo for desconectado, tenta de novo sozinho
const serial = (valoresSensorAnalogico, valoresSensorDigital) => {
    const poolBancoDados = criarPool();

    const conectar = async () => {
        let caminho;
        try {
            caminho = await encontrarPortaArduino();
        } catch (err) {
            console.error(err.message + ` — tentando de novo em ${INTERVALO_RECONEXAO / 1000} s`);
            setTimeout(conectar, INTERVALO_RECONEXAO);
            return;
        }

        const arduino = new serialport.SerialPort({ path: caminho, baudRate: SERIAL_BAUD_RATE });
        let reconectando = false;
        const reconectar = () => {
            if (reconectando) return;
            reconectando = true;
            console.error(`Conexão com o Arduino perdida — tentando de novo em ${INTERVALO_RECONEXAO / 1000} s`);
            setTimeout(conectar, INTERVALO_RECONEXAO);
        };

        arduino.on('open', () => {
            console.log(`A leitura do arduino foi iniciada na porta ${caminho} utilizando Baud Rate de ${SERIAL_BAUD_RATE} (sensor ${ID_SENSOR_ARDUINO})`);
        });
        arduino.on('error', (erro) => {
            console.error(`Erro no arduino: ${erro.message}`);
            reconectar();
        });
        arduino.on('close', reconectar);

        arduino.pipe(new serialport.ReadlineParser({ delimiter: '\n' })).on('data', async (data) => {
            const leitura = interpretarLinha(data);
            if (!leitura) {
                console.warn('Linha ignorada do Arduino:', String(data).trim());
                return;
            }

            guardar(valoresSensorAnalogico, leitura.temperatura);
            guardar(valoresSensorDigital, leitura.umidade);

            if (HABILITAR_OPERACAO_INSERIR) {
                try {
                    await poolBancoDados.execute(
                        'INSERT INTO coleta_dados (umidade, temperatura, fksensor) VALUES (?, ?, ?)',
                        [leitura.umidade, leitura.temperatura, ID_SENSOR_ARDUINO]
                    );
                    console.log(`Arduino -> S${ID_SENSOR_ARDUINO}: ${leitura.temperatura}°C ${leitura.umidade}%`);
                } catch (err) {
                    console.error("Erro ao inserir dados reais no banco:", err.message);
                }
            }
        });
    };

    conectar();
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorAnalogico,
    valoresSensorDigital
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta http://localhost:${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/analogico', (_, response) => {
        return response.status(200).json({
            temperatura: valoresSensorAnalogico,
            umidade: valoresSensorDigital
        });
    });
}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorAnalogico = [];
    const valoresSensorDigital = []

    // MODO_MOCK: tudo simulado. Híbrido: Arduino real na colmeia 1 + mock no resto
    if (!MODO_MOCK) {
        serial(valoresSensorAnalogico, valoresSensorDigital);
    }
    await serialMock(valoresSensorAnalogico, valoresSensorDigital);

    // inicia o servidor web
    servidor(
        valoresSensorAnalogico,
        valoresSensorDigital
    );
})();