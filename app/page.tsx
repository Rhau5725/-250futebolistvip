"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import "./certificate.css";

const warmups = [
  { name: "Semáforo com Bola", time: "8 min", age: "5–9 anos", material: "1 bola por atleta + 8 cones", steps: ["Monte um quadrado de 15 x 15 m e espalhe os jogadores com bola.", "Verde: condução rápida. Amarelo: domínio curto. Vermelho: pare a bola com a sola.", "A cada 45 segundos, troque o comando e peça uma mudança de direção.", "Finalize com 2 rodadas de 30 segundos usando apenas o pé não dominante."], focus: "Ativação, domínio e reação" },
  { name: "Caça às Cores", time: "7 min", age: "7–11 anos", material: "12 cones de 4 cores + bolas", steps: ["Distribua quatro cores de cones em um espaço de 18 x 18 m.", "Todos conduzem a bola sem se encostar.", "Ao chamar uma cor, cada atleta acelera até um cone daquela cor e faz a volta por fora.", "Na última rodada, chame duas cores em sequência para estimular memória e reação."], focus: "Percepção, aceleração e coordenação" },
  { name: "Passe e Desperta", time: "10 min", age: "9–13 anos", material: "6 cones + 1 bola por trio", steps: ["Forme triângulos de 7 m com três jogadores e uma bola.", "O atleta passa e corre até o cone livre, mantendo o triângulo em movimento.", "Após 2 minutos, limite a dois toques e peça comunicação antes do passe.", "Termine com disputa: primeiro trio a completar 20 passes limpos vence."], focus: "Passe, mobilidade e comunicação" },
];

const agilityPlans = [
  { name: "Circuito Raio", time: "9 min", material: "6 cones e 1 bola", sequence: "Zigue-zague → aceleração de 5 m → domínio orientado → retorno leve", rounds: "3 séries de 45 s, com 30 s de pausa" },
  { name: "Espelho Turbo", time: "8 min", material: "4 cones por dupla", sequence: "Um líder muda de direção; o parceiro copia sem cruzar os pés", rounds: "4 séries de 30 s; troque o líder a cada série" },
  { name: "Portas Relâmpago", time: "10 min", material: "10 cones e bolas", sequence: "Comando de cor → aceleração → passe pela porta → mudança de direção", rounds: "4 séries de 50 s, com 25 s de pausa" },
];

const vipObjectives = ["Técnica", "Decisão", "Finalização", "Criatividade", "Equipe", "Coordenação"];
const vipSessionNames = ["Academia do Primeiro Toque", "Laboratório de Espaços", "Clube dos Finalizadores", "Oficina do Improviso", "Esquadrão Conectado", "Movimento de Craque", "Domínio Sob Pressão", "Jogo das Decisões", "Ataque em Ondas", "Fábrica de Soluções"];
const vipSessions = vipObjectives.flatMap((objective, oi) => vipSessionNames.map((name, i) => ({
  id: oi * 10 + i + 1,
  title: `${name} ${i + 1}`,
  objective,
  age: ["5–7", "7–9", "9–11", "11–13"][(i + oi) % 4],
  duration: [45, 50, 60, 70][(i + oi) % 4],
  players: ["6–10", "8–12", "10–14"][(i + oi) % 3],
  mission: ["controlar e jogar antes da pressão", "enxergar duas opções antes de receber", "criar vantagem sem ficar parado", "resolver o lance usando os dois pés"][(i + oi) % 4],
  blocks: [
    `Ativação VIP: circuito curto com bola, estímulo visual e mudança de direção (${8 + i % 3} min).`,
    `Fundamento guiado: duplas cumprem metas progressivas de ${objective.toLowerCase()}, sem filas (${12 + i % 4} min).`,
    `Jogo condicionado: ponto extra ao conseguir ${["apoio rápido", "troca de corredor", "finalização consciente", "participação de todos"][i % 4]} (${18 + i % 5} min).`,
    `Desafio final: equipe precisa completar a missão “${["3 decisões corretas seguidas", "gol com dois pés", "recuperar em 5 segundos", "todos participam da jogada"][i % 4]}”.`
  ]
})));

const magicChallengeNames = ["Embaixadinha Alternada", "Sola Relâmpago", "Parede Precisa", "Giro do Mágico", "Túnel de Cones", "Alvo Secreto", "Pé Fraco Valente", "Domínio Silencioso"];
const magicChallenges = Array.from({ length: 56 }, (_, i) => ({
  id: i + 1,
  title: `${magicChallengeNames[i % magicChallengeNames.length]} • Nível ${Math.floor(i / 8) + 1}`,
  duration: [5, 6, 7, 8][i % 4],
  equipment: ["1 bola", "1 bola e uma parede", "1 bola e 4 cones", "1 bola e 2 alvos"][i % 4],
  task: [
    `Faça ${10 + i} contatos alternando os pés sem deixar a bola escapar do seu espaço.`,
    `Conduza em oito por ${20 + i} segundos e pare a bola exatamente na marca ao sinal.`,
    `Complete ${8 + (i % 12)} passes no alvo; a bola deve voltar dominada em até dois toques.`,
    `Crie três movimentos diferentes, dê um nome para cada um e execute a sequência sem repetir.`,
    `Passe por quatro portas em ordem diferente, usando uma mudança de direção em cada porta.`,
    `Acerte o alvo ${5 + (i % 8)} vezes alternando finalização colocada e rasteira.`,
    `Use somente o pé não dominante por ${30 + i} segundos e conclua com um passe preciso.`,
    `Receba cinco bolas de direções diferentes e deixe cada uma pronta para a próxima ação.`
  ][i % 8],
  level: ["Iniciante", "Explorador", "Craque", "Lenda"][(Math.floor(i / 14)) % 4],
  win: ["Complete sem perder o controle.", "Supere sua primeira marca mantendo a técnica.", "Faça duas rodadas perfeitas seguidas.", "Ensine o desafio a um colega após concluir."][i % 4]
}));

type Drill = {
  id: number;
  title: string;
  category: string;
  age: string;
  time: number;
  players: string;
  level: "Fácil" | "Médio" | "Intenso";
  goal: string;
  setup: string;
  rule: string;
  hook: string;
  materials: string;
  execution: string;
  coach: string;
  progression: string;
  commonError: string;
  success: string;
  adaptation: string;
  safety: string;
  layout: number;
};

const groups = [
  { name: "Aquecimento", icon: "⚡", goals: ["ativação e reação", "mobilidade com bola", "ritmo e coordenação"], setups: ["quadrado de 12 m", "2 filas e 4 cones", "círculo de 10 m"], rules: ["Troque de direção ao sinal.", "Conduza sem repetir o caminho.", "Acelere após cada passe."] },
  { name: "Domínio", icon: "◉", goals: ["primeiro toque", "orientação corporal", "controle sob pressão"], setups: ["4 portas coloridas", "losango de 10 m", "corredor com 6 cones"], rules: ["Domine para a cor chamada.", "O segundo toque já deve avançar.", "Use os dois pés a cada rodada."] },
  { name: "Passe", icon: "↗", goals: ["precisão e apoio", "passe em movimento", "visão periférica"], setups: ["triângulo de 8 m", "3 zonas e 2 bolas", "roda com um jogador central"], rules: ["Passe e ocupe o espaço vazio.", "Conte 6 passes para marcar.", "Jogue com no máximo dois toques."] },
  { name: "Drible", icon: "〽", goals: ["mudança de direção", "criatividade no 1x1", "proteção da bola"], setups: ["rua de 12 x 5 m", "4 miniportas", "ilha central com cones"], rules: ["Passe pela porta sem perder a bola.", "O atacante escolhe um dos lados.", "Vale ponto extra com o pé não dominante."] },
  { name: "Finalização", icon: "◎", goals: ["chute rápido", "decisão perto do gol", "precisão na batida"], setups: ["2 filas a 12 m do gol", "3 zonas de finalização", "gol com 4 alvos"], rules: ["Finalize antes da linha limite.", "Cada alvo vale uma pontuação.", "Receba, gire e chute em 3 segundos."] },
  { name: "1x1", icon: "⚔", goals: ["coragem para atacar", "tempo de desarme", "decisão ofensiva"], setups: ["campo de 12 x 8 m", "2 gols de cones", "zona central de duelo"], rules: ["Ataque um dos dois gols.", "Troque os papéis após cada duelo.", "O defensor pontua se conduzir para fora."] },
  { name: "Posse", icon: "◇", goals: ["criar linhas de passe", "jogar de cabeça erguida", "reação pós-perda"], setups: ["quadrado de 15 m", "3 corredores", "campo com 4 apoios externos"], rules: ["Cinco passes valem um ponto.", "Recupere em até 5 segundos.", "Mude de corredor antes de pontuar."] },
  { name: "Coordenação", icon: "✦", goals: ["agilidade e equilíbrio", "coordenação olho-pé", "velocidade de resposta"], setups: ["escada e 4 cones", "circuito em oito", "3 estações curtas"], rules: ["Execute e saia conduzindo.", "Copie o movimento do líder.", "Complete o circuito sem tocar nos cones."] },
  { name: "Cooperação", icon: "✺", goals: ["comunicação em equipe", "solução coletiva", "confiança entre colegas"], setups: ["ilhas de 4 jogadores", "campo dividido em 3", "círculo com 2 bolas"], rules: ["Todos devem tocar na bola.", "A equipe escolhe a melhor solução.", "Celebre junto após cada ponto."] },
  { name: "Jogo", icon: "★", goals: ["leitura de jogo", "transição rápida", "tomada de decisão"], setups: ["campo de 24 x 16 m", "3 mini-gols", "campo com zonas bônus"], rules: ["Gol após troca de corredor vale dois.", "Ao recuperar, ataque em 6 segundos.", "Cada rodada traz uma missão surpresa."] },
];

const prefixes = ["Relâmpago", "Caça", "Missão", "Desafio", "Circuito", "Duelo", "Rota", "Labirinto", "Batalha", "Festival", "Código", "Expresso", "Guardiões"];
const suffixes = ["das Cores", "do Capitão", "do Gol", "dos Cones", "Turbo", "360", "Surpresa", "em Equipe", "do Craque", "Sem Parar", "da Amizade", "do Relógio", "Mágico"];
const ages = ["5–7", "7–9", "9–11", "11–13"];
const levels: Drill["level"][] = ["Fácil", "Médio", "Intenso"];

const drills: Drill[] = groups.flatMap((group, gi) =>
  Array.from({ length: 26 }, (_, i) => ({
    id: gi * 26 + i + 1,
    title: `${prefixes[(i + gi) % prefixes.length]} ${suffixes[(i * 3 + gi) % suffixes.length]}`,
    category: group.name,
    age: ages[(i + gi) % ages.length],
    time: [8, 10, 12, 15][(i * 2 + gi) % 4],
    players: ["4–6", "6–8", "8–10", "10–14"][(i + gi * 2) % 4],
    level: levels[(i + gi) % levels.length],
    goal: group.goals[i % group.goals.length],
    setup: group.setups[(i + 1) % group.setups.length],
    rule: group.rules[(i * 2) % group.rules.length],
    hook: ["Último ponto vale o dobro!", "Quem vence escolhe a comemoração!", "Bata seu próprio recorde!", "Rodada final em câmera lenta!"][(i + gi) % 4],
    materials: ["6 cones, 4 bolas e 2 coletes", "8 cones, 1 bola por dupla e 4 coletes", "10 cones, 3 bolas e 2 mini-gols", "6 discos, 2 bolas e coletes de duas cores"][(i + gi) % 4],
    execution: [
      `Divida o grupo em duplas. Um jogador inicia com a bola e o parceiro oferece apoio. Ao sinal, realizam a missão de ${group.goals[i % group.goals.length]} e trocam de função após cada tentativa.`,
      "Organize duas equipes equilibradas. A bola começa na zona central; cada equipe cumpre a regra, avança com controle e conclui a ação antes de reiniciar do outro lado.",
      "Demonstre uma repetição em velocidade baixa. Depois, libere rodadas de 45 segundos, com 20 segundos para recuperar e receber uma nova orientação.",
      "Numere os jogadores. Ao chamar um número, os participantes entram no espaço, executam a tarefa e retornam por fora para a próxima rodada começar sem espera."
    ][(i * 2 + gi) % 4],
    coach: ["Incentive cabeça erguida e pequenos ajustes antes do contato com a bola.", "Corrija uma coisa por rodada: posição do corpo, escolha ou velocidade.", "Faça perguntas curtas: onde está o espaço e qual é a melhor opção?", "Valorize a tentativa criativa e elogie a decisão, não apenas o acerto."][(i + gi * 2) % 4],
    progression: ["Reduza o espaço em 2 metros ou limite a dois toques.", "Inclua um defensor passivo; depois, libere a pressão total.", "Use o pé não dominante na rodada final.", "Transforme a missão em competição por equipes até 5 pontos."][(i * 3 + gi) % 4],
    commonError: ["Crianças esperando paradas na fila. Crie duas estações iguais ou inicie uma nova tentativa a cada 5 segundos.", "Jogadores olhando somente para a bola. Peça que mostrem com os dedos quantos cones coloridos enxergam antes de agir.", "Execução acelerada e sem controle. Aumente o espaço, retire a oposição e recupere a qualidade antes de elevar o ritmo.", "O mesmo participante domina todas as ações. Use rodízio obrigatório e dê ponto bônus quando todos participarem."][(i + gi) % 4],
    success: ["A atividade funciona quando há poucas filas, muitas ações com bola e pelo menos 7 acertos em cada 10 tentativas.", "Considere a missão dominada quando as crianças reconhecem o espaço antes de receber e mantêm a bola sob controle.", "O grupo deve executar três rodadas seguidas entendendo a regra sem novas interrupções do treinador.", "Procure decisões variadas, comunicação espontânea e recuperação rápida depois de perder a bola."][(i * 2 + gi) % 4],
    adaptation: ["Para 5–7 anos, amplie o espaço e permita mais toques. Para 9 anos ou mais, reduza o campo e adicione oposição.", "Com iniciantes, faça sem defensor e use demonstração visual. Com avançados, limite tempo e número de toques.", "Em grupos grandes, duplique a estação. Em grupos pequenos, use um coringa para manter superioridade e fluidez.", "Se houver níveis diferentes, dê uma missão individual: pé dominante para iniciantes e pé não dominante para avançados."][(i * 3 + gi) % 4],
    safety: ["Mantenha no mínimo 2 metros entre estações e deixe bolas extras fora da área de movimento.", "Oriente o retorno por fora do campo para evitar cruzamentos com quem está executando.", "Cheque o piso, fixe os mini-gols e interrompa a rodada se houver choque ou perda de organização.", "Use cones baixos, água próxima e pausas curtas; a qualidade do movimento vale mais que a velocidade."][(i + gi * 3) % 4],
    layout: (i + gi) % 4,
  }))
);

function Field({ drill, large = false }: { drill: Drill; large?: boolean }) {
  const patterns = [
    [[18, 22, "player"], [50, 48, "ball"], [80, 72, "player"], [50, 18, "cone"], [22, 70, "cone"]],
    [[20, 50, "player"], [50, 22, "player"], [80, 50, "player"], [50, 78, "ball"], [36, 48, "cone"], [64, 48, "cone"]],
    [[16, 25, "cone"], [16, 75, "cone"], [84, 25, "cone"], [84, 75, "cone"], [36, 50, "player"], [65, 50, "ball"]],
    [[12, 50, "player"], [32, 25, "cone"], [50, 50, "ball"], [68, 75, "cone"], [88, 50, "player"]],
  ];
  return <div className={`field ${large ? "field-large" : ""}`} aria-label={`Diagrama: ${drill.title}`}>
    <div className="midline" /><div className="center-circle" />
    {patterns[drill.layout].map(([x, y, type], index) => <span key={index} className={`marker ${type}`} style={{ left: `${x}%`, top: `${y}%` }} />)}
    <span className="route r1" /><span className="route r2" />
  </div>;
}

function Detail({ drill, onClose, reel = false }: { drill: Drill; onClose: () => void; reel?: boolean }) {
  const group = groups.find(g => g.name === drill.category)!;
  return <div className={`overlay ${reel ? "reel-overlay" : ""}`} role="dialog" aria-modal="true" aria-label={drill.title} onClick={onClose}>
    <article className={reel ? "reel-card" : "detail-card"} onClick={e => e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Fechar">×</button>
      <div className="detail-top"><span>{group.icon}</span><b>DINÂMICA {String(drill.id).padStart(3, "0")}</b></div>
      <h2>{drill.title}</h2>
      <div className="chips"><span>{drill.category}</span><span>{drill.age} anos</span><span>{drill.time} min</span></div>
      <Field drill={drill} large />
      {reel ? <div className="steps">
        <div><i>1</i><p><b>Monte</b>{drill.setup}</p></div>
        <div><i>2</i><p><b>Jogue</b>{drill.rule}</p></div>
        <div><i>3</i><p><b>Missão</b>{drill.hook}</p></div>
      </div> : <div className="full-guide">
        <div className="guide-intro"><b>PLANO DE APLICAÇÃO</b><p>Use esta ficha como roteiro. Demonstre uma vez, deixe as crianças experimentarem e faça correções curtas entre as rodadas.</p></div>
        <div className="drill-guide">
          <section><span>◎</span><div><small>OBJETIVO PRINCIPAL</small><p>Desenvolver <strong>{drill.goal}</strong>. A criança deve perceber o espaço, escolher uma solução e executar o gesto técnico sem permanecer parada.</p></div></section>
          <section><span>▦</span><div><small>ESPAÇO E MATERIAIS</small><p>Monte um <strong>{drill.setup}</strong>. Separe {drill.materials}. Deixe uma área livre ao redor para circulação e reposição das bolas.</p></div></section>
          <section><span>♟</span><div><small>FORMAÇÃO DO GRUPO</small><p>Trabalhe com {drill.players} jogadores. Divida-os em equipes equilibradas e identifique-as com coletes. Evite filas com mais de três crianças.</p></div></section>
          <section><span>◷</span><div><small>DISTRIBUIÇÃO DO TEMPO</small><p><strong>{drill.time} minutos:</strong> 2 min para explicar e demonstrar; {Math.max(4, drill.time - 5)} min em rodadas ativas; 2 min com progressão; 1 min para feedback e água.</p></div></section>
          <section className="wide execution"><span>▶</span><div><small>PASSO A PASSO</small><ol><li>Posicione os jogadores e mostre onde começa e termina cada ação.</li><li>{drill.execution}</li><li>A regra central é: <strong>{drill.rule}</strong></li><li>Reinicie rapidamente após ponto, saída da bola ou conclusão. Troque funções para todos atacarem, defenderem e apoiarem.</li><li>Finalize com a missão: <strong>{drill.hook}</strong></li></ol></div></section>
          <section className="coach"><span>✦</span><div><small>INTERVENÇÃO DO TREINADOR</small><p>{drill.coach} Observe primeiro, escolha apenas um comportamento para corrigir e use uma demonstração curta. Evite parar toda a turma por um erro individual.</p></div></section>
          <section><span>!</span><div><small>ERRO COMUM E CORREÇÃO</small><p>{drill.commonError}</p></div></section>
          <section><span>✓</span><div><small>CRITÉRIO DE SUCESSO</small><p>{drill.success}</p></div></section>
          <section><span>↔</span><div><small>ADAPTAÇÕES</small><p>{drill.adaptation}</p></div></section>
          <section><span>↗</span><div><small>PROGRESSÃO</small><p>{drill.progression} Só avance quando a maioria compreender a dinâmica e realizar o objetivo com controle.</p></div></section>
          <section><span>＋</span><div><small>SEGURANÇA E FLUIDEZ</small><p>{drill.safety}</p></div></section>
        </div>
        <div className="coach-questions"><small>PERGUNTAS PARA O FECHAMENTO</small><p>“O que ajudou você a decidir?” • “Onde havia mais espaço?” • “Como o colega ajudou a jogada?”</p></div>
      </div>}
      {reel && <div className="reel-footer"><span>⚽ FUTEBOL EM JOGO</span><b>Salve para o próximo treino</b></div>}
    </article>
  </div>;
}

function BonusTool({ tool, onClose }: { tool: number; onClose: () => void }) {
  const athlete = ""; const award = "Evolução no treino"; const coachName = ""; const certificateDate = new Date().toISOString().slice(0, 10);
  const [choice, setChoice] = useState(0);
  const [duration, setDuration] = useState(60);
  const [checked, setChecked] = useState<number[]>([]);
  const warmup = warmups[choice % warmups.length];
  const agility = agilityPlans[choice % agilityPlans.length];
  const downloadCertificate = async () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const green = [5, 76, 48] as [number, number, number]; const gold = [213, 169, 63] as [number, number, number];
    doc.setFillColor(250, 249, 245); doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(...green); doc.triangle(0, 0, 86, 0, 0, 75, "F"); doc.triangle(297, 210, 211, 210, 297, 135, "F");
    doc.setFillColor(...gold); doc.triangle(0, 13, 67, 0, 0, 58, "F"); doc.triangle(297, 197, 230, 210, 297, 152, "F");
    doc.setDrawColor(...gold); doc.setLineWidth(1.4); doc.rect(12, 12, 273, 186); doc.setDrawColor(...green); doc.setLineWidth(.5); doc.rect(15, 15, 267, 180);
    doc.setTextColor(...green); doc.setFont("helvetica", "bold"); doc.setFontSize(34); doc.text("CERTIFICADO", 148.5, 48, { align: "center" });
    doc.setTextColor(20, 20, 20); doc.setFontSize(17); doc.text("DE CRAQUE", 148.5, 61, { align: "center" });
    doc.setTextColor(...gold); doc.setFontSize(16); doc.text("★", 148.5, 75, { align: "center" });
    doc.setTextColor(55, 55, 55); doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.text("Este certificado é concedido a", 148.5, 91, { align: "center" });
    doc.setTextColor(...green); doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.text((athlete || "NOME DO ATLETA").toUpperCase(), 148.5, 110, { align: "center" });
    doc.setDrawColor(...gold); doc.line(75, 115, 222, 115);
    doc.setTextColor(45, 45, 45); doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.text(`por ${award.toLowerCase()}, dedicação, esforço e paixão pelo futebol.`, 148.5, 128, { align: "center" });
    doc.text("Parabéns por superar desafios e ser um craque dentro e fora de campo!", 148.5, 137, { align: "center" });
    doc.setDrawColor(...green); doc.line(55, 169, 112, 169); doc.line(185, 169, 242, 169);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.text((coachName || "TREINADOR").toUpperCase(), 83.5, 177, { align: "center" });
    doc.text(certificateDate.split("-").reverse().join("/"), 213.5, 177, { align: "center" });
    doc.setTextColor(...gold); doc.setFontSize(13); doc.text("FUTEBOL EM JOGO", 148.5, 188, { align: "center" });
    const imageBlob = await fetch("/certificado-craque-premium.png").then(r => r.blob());
    const imageData = await new Promise<string>(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(imageBlob); });
    doc.addImage(imageData, "PNG", 0, 0, 297, 210);
    doc.save("certificado-de-craque.pdf");
  };
  const titles = ["Aquecimentos Prontos", "Certificado de Craque", "Organização de Treino", "Agilidade e Velocidade"];
  return <div className="overlay bonus-overlay" role="dialog" aria-modal="true" aria-label={titles[tool - 1]} onClick={onClose}>
    <article className="bonus-tool" onClick={e => e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Fechar">×</button>
      <span className="tool-kicker">BÔNUS {tool} • FERRAMENTA PRÁTICA</span><h2>{titles[tool - 1]}</h2>
      {tool === 1 && <>
        <div className="tool-tabs">{warmups.map((item, i) => <button key={item.name} className={choice === i ? "active" : ""} onClick={() => setChoice(i)}>{item.name}</button>)}</div>
        <div className="ready-plan"><div className="plan-summary"><span>⏱ {warmup.time}</span><span>👟 {warmup.age}</span><span>🎯 {warmup.focus}</span></div><h3>{warmup.name}</h3><p><b>MATERIAIS:</b> {warmup.material}</p><ol>{warmup.steps.map((step, i) => <li key={step}><i>{i + 1}</i><span>{step}</span></li>)}</ol><div className="coach-call"><b>COMANDO DO TREINADOR</b><span>“Cabeça erguida, bola perto do pé e acelera quando ouvir o sinal!”</span></div></div>
      </>}
      {tool === 2 && <div className="certificate-maker certificate-only"><div className="certificate-actions"><button onClick={downloadCertificate}>↓ Baixar em PDF</button><button className="print-button" onClick={() => window.print()}>▣ Imprimir</button></div><div className="certificate-image-preview"><img src="/certificado-craque-premium.png" alt="Certificado de Craque em verde e dourado"/></div></div>}
      {tool === 3 && <div className="planner"><label>Duração do treino: <b>{duration} minutos</b><input type="range" min="40" max="100" step="10" value={duration} onChange={e => setDuration(Number(e.target.value))} /></label><div className="timeline"><div style={{flex:1}}><b>1</b><span>Aquecimento<strong>{Math.round(duration * .15)} min</strong></span></div><div style={{flex:2}}><b>2</b><span>Técnica<strong>{Math.round(duration * .3)} min</strong></span></div><div style={{flex:2}}><b>3</b><span>Jogo aplicado<strong>{Math.round(duration * .35)} min</strong></span></div><div style={{flex:1}}><b>4</b><span>Desafio final<strong>{Math.round(duration * .15)} min</strong></span></div></div><h3>Checklist do treinador</h3>{["Separar bolas, cones e coletes", "Definir objetivo e regra principal", "Preparar duas variações", "Organizar água e área segura", "Fechar com feedback da turma"].map((item, i) => <button className={`check-row ${checked.includes(i) ? "done" : ""}`} key={item} onClick={() => setChecked(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i])}><i>{checked.includes(i) ? "✓" : ""}</i>{item}</button>)}</div>}
      {tool === 4 && <><div className="tool-tabs">{agilityPlans.map((item, i) => <button key={item.name} className={choice === i ? "active" : ""} onClick={() => setChoice(i)}>{item.name}</button>)}</div><div className="agility-tool"><div className="agility-track"><span>1</span><i>↝</i><span>2</span><i>↝</i><span>3</span><i>↝</i><span>⚽</span></div><h3>{agility.name}</h3><div><small>DURAÇÃO</small><b>{agility.time}</b></div><div><small>MATERIAIS</small><b>{agility.material}</b></div><div><small>SEQUÊNCIA</small><b>{agility.sequence}</b></div><div><small>VOLUME</small><b>{agility.rounds}</b></div><p><strong>Progressão:</strong> cronometre cada rodada e desafie o atleta a repetir com técnica antes de tentar superar o tempo.</p></div></>}
    </article>
  </div>;
}

function VipTool({ tool, onClose }: { tool: "library" | "challenges"; onClose: () => void }) {
  const [objective, setObjective] = useState("Todos");
  const [session, setSession] = useState(vipSessions[0]);
  const [week, setWeek] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const sessions = objective === "Todos" ? vipSessions : vipSessions.filter(s => s.objective === objective);
  const weekly = magicChallenges.slice(week * 7, week * 7 + 7);
  return <div className="overlay vip-tool-overlay" role="dialog" aria-modal="true" onClick={onClose}>
    <article className="vip-tool" onClick={e => e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Fechar">×</button>
      <span className="tool-kicker">🔒 CONTEÚDO EXCLUSIVO VIP</span>
      {tool === "library" ? <>
        <h2>Biblioteca VIP</h2><p className="tool-lead">60 treinos completos e exclusivos. Cada plano já vem dividido em blocos para aplicar do início ao fim.</p>
        <div className="vip-filter"><button className={objective === "Todos" ? "active" : ""} onClick={() => setObjective("Todos")}>Todos <small>60</small></button>{vipObjectives.map(o => <button key={o} className={objective === o ? "active" : ""} onClick={() => {setObjective(o); setSession(vipSessions.find(s => s.objective === o)!);}}>{o} <small>10</small></button>)}</div>
        <div className="vip-library-layout"><div className="vip-session-list">{sessions.map(item => <button key={item.id} className={session.id === item.id ? "active" : ""} onClick={() => setSession(item)}><span>{String(item.id).padStart(2,"0")}</span><div><b>{item.title}</b><small>{item.objective} • {item.age} anos</small></div><i>→</i></button>)}</div><div className="vip-session-detail"><span className="session-badge">PLANO VIP {String(session.id).padStart(2,"0")}</span><h3>{session.title}</h3><div className="plan-summary"><span>⏱ {session.duration} min</span><span>👥 {session.players}</span><span>🎯 {session.objective}</span></div><p><b>MISSÃO:</b> {session.mission}</p><ol>{session.blocks.map((block, i) => <li key={block}><i>{i + 1}</i><span>{block}</span></li>)}</ol><div className="coach-call"><b>RESULTADO ESPERADO</b><span>Atletas ativos, decisões variadas e evolução observável ao final da sessão.</span></div></div></div>
      </> : <>
        <h2>7 Dias de Pé Mágico</h2><p className="tool-lead">56 desafios exclusivos organizados em 8 semanas. Nenhum deles faz parte das +250 dinâmicas básicas.</p>
        <div className="week-picker">{Array.from({length:8},(_,i)=><button key={i} className={week === i ? "active" : ""} onClick={() => setWeek(i)}>Semana {i+1}</button>)}</div>
        <div className="challenge-progress"><span style={{width:`${completed.length / 56 * 100}%`}}/><b>{completed.length}/56 concluídos</b></div>
        <div className="challenge-list">{weekly.map((challenge, day) => <article key={challenge.id} className={completed.includes(challenge.id) ? "complete" : ""}><div className="challenge-day"><small>DIA</small><b>{day + 1}</b></div><div className="challenge-copy"><span>{challenge.level} • {challenge.duration} min</span><h3>{challenge.title}</h3><p>{challenge.task}</p><small><b>MATERIAL:</b> {challenge.equipment}</small><em>🏆 {challenge.win}</em></div><button onClick={() => setCompleted(c => c.includes(challenge.id) ? c.filter(id => id !== challenge.id) : [...c, challenge.id])}>{completed.includes(challenge.id) ? "✓ Feito" : "Marcar feito"}</button></article>)}</div>
      </>}
    </article>
  </div>;
}

export default function Home() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Drill | null>(null);
  const [reel, setReel] = useState<Drill | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [visible, setVisible] = useState(12);
  const [bonusTool, setBonusTool] = useState<number | null>(null);
  const [vipTool, setVipTool] = useState<"library" | "challenges" | null>(null);
  const filtered = useMemo(() => drills.filter(d => (category === "Todos" || d.category === category) && (`${d.title} ${d.goal}`).toLowerCase().includes(query.toLowerCase())), [category, query]);
  const chooseRandom = () => setSelected(filtered[Math.floor(Math.random() * filtered.length)] || drills[0]);
  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Futebol em Jogo"><span>⚽</span><div>FUTEBOL<small>EM JOGO</small></div></a>
      <nav><a href="#biblioteca">Biblioteca</a><a href="#bonus">Bônus</a><a href="#vip">Área VIP</a></nav>
      <button className="saved-pill" onClick={() => { setCategory("Todos"); setQuery(""); setVisible(260); }}>♥ {saved.length}</button>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><span className="eyebrow">A CAIXA DE FERRAMENTAS DO TREINADOR</span><h1>+250 dinâmicas.<br/><em>Zero treino parado.</em></h1><p>Escolha, aplique e grave. Atividades infantis que prendem a atenção dentro e fora do campo.</p><div className="hero-actions"><a href="#biblioteca" className="primary">Explorar dinâmicas <span>↓</span></a><button className="secondary" onClick={chooseRandom}>✦ Surpreenda-me</button></div><div className="trust"><span><b>+250</b> atividades</span><span><b>4</b> faixas etárias</span><span><b>10</b> objetivos</span></div></div>
      <div className="hero-visual"><div className="stack-card stack-3"/><div className="stack-card stack-2"/><article className="feature-card"><div className="fc-head"><span>DINÂMICA 087</span><b>↗</b></div><h3>Rota do Capitão</h3><p>PASSE • 7–9 ANOS</p><Field drill={drills[86]} large /><div className="mini-steps"><span><i>1</i> Monte</span><span><i>2</i> Jogue</span><span><i>3</i> Celebre</span></div></article><div className="sticker">100%<br/><b>PRÁTICO</b></div></div>
    </section>

    <section className="library" id="biblioteca">
      <div className="section-heading"><div><span className="eyebrow dark">ESCOLHA O FOCO</span><h2>O que vamos treinar hoje?</h2></div><button onClick={chooseRandom}>↻ Sortear uma dinâmica</button></div>
      <div className="category-strip"><button className={category === "Todos" ? "active" : ""} onClick={() => {setCategory("Todos"); setVisible(12)}}><span>✦</span>Todos<small>+250</small></button>{groups.map(g => <button key={g.name} className={category === g.name ? "active" : ""} onClick={() => {setCategory(g.name); setVisible(12)}}><span>{g.icon}</span>{g.name}<small>26</small></button>)}</div>
      <div className="tools"><label><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome ou objetivo..." /></label><span>{filtered.length} dinâmicas encontradas</span></div>
      <div className="grid">{filtered.slice(0, visible).map(drill => <article className="drill-card" key={drill.id}>
        <button className={`heart ${saved.includes(drill.id) ? "liked" : ""}`} onClick={() => setSaved(s => s.includes(drill.id) ? s.filter(id => id !== drill.id) : [...s, drill.id])} aria-label="Favoritar">♥</button>
        <button className="card-main" onClick={() => setSelected(drill)}><div className="card-head"><span>{String(drill.id).padStart(3, "0")}</span><b>{groups.find(g => g.name === drill.category)?.icon}</b></div><Field drill={drill}/><div className="card-body"><small>{drill.category} • {drill.age} ANOS</small><h3>{drill.title}</h3><p>{drill.goal}</p><div><span>◷ {drill.time} min</span><span>♟ {drill.players}</span><span className={`level l-${drill.level.toLowerCase()}`}>{drill.level}</span></div></div></button>
        <button className="reel-button" onClick={() => setReel(drill)}>▯ Modo Reel</button>
      </article>)}</div>
      {visible < filtered.length && <button className="load" onClick={() => setVisible(v => v + 24)}>Carregar mais <span>↓</span></button>}
    </section>

    <section className="bonus-section" id="bonus">
      <div className="bonus-heading"><div><span className="eyebrow dark">CONTEÚDO QUE ACELERA RESULTADOS</span><h2>🎁 Bônus exclusivos</h2></div><span className="bonus-seal">4 BÔNUS<br/><b>INCLUSOS</b></span></div>
      <div className="bonus-grid">
        <article><i>01</i><div className="bonus-icon">⚡</div><small>BÔNUS 1</small><h3>Aquecimentos Prontos</h3><p>Escolha uma rotina e leve o passo a passo direto para o campo.</p><ul><li>3 rotinas completas</li><li>Tempo, materiais e comandos</li><li>Aplicação sem filas</li></ul><button className="open-tool" onClick={() => setBonusTool(1)}>Abrir aquecimentos <b>→</b></button></article>
        <article><i>02</i><div className="bonus-icon">🏅</div><small>BÔNUS 2</small><h3>Certificados de Craque</h3><p>Digite o nome, escolha a conquista e gere o certificado na hora.</p><ul><li>Personalização imediata</li><li>4 tipos de conquista</li><li>Pronto para imprimir</li></ul><button className="open-tool" onClick={() => setBonusTool(2)}>Criar certificado <b>→</b></button></article>
        <article><i>03</i><div className="bonus-icon">▤</div><small>BÔNUS 3</small><h3>Organização de Treinos</h3><p>Defina a duração e receba uma sessão dividida automaticamente.</p><ul><li>Linha do tempo ajustável</li><li>Divisão inteligente</li><li>Checklist interativo</li></ul><button className="open-tool" onClick={() => setBonusTool(3)}>Montar meu treino <b>→</b></button></article>
        <article><i>04</i><div className="bonus-icon">🚀</div><small>BÔNUS 4</small><h3>Agilidade e Velocidade</h3><p>Abra circuitos completos com sequência, volume e progressão.</p><ul><li>3 circuitos aplicáveis</li><li>Séries e pausas definidas</li><li>Progressão por desempenho</li></ul><button className="open-tool" onClick={() => setBonusTool(4)}>Abrir circuitos <b>→</b></button></article>
      </div>
    </section>

    <section className="vip-section" id="vip">
      <div className="vip-header"><span className="vip-lock">🔒</span><div><span className="eyebrow">ACESSO ESPECIAL DO TREINADOR</span><h2>Área VIP</h2><p>Planejamento contínuo para transformar atividades isoladas em uma temporada completa de evolução.</p></div><span className="vip-badge">MEMBRO VIP</span></div>
      <div className="vip-grid">
        <article className="vip-library"><div className="vip-card-top"><span>📚</span><small>BIBLIOTECA EXCLUSIVA</small></div><h3>60 treinos VIP</h3><p>Uma biblioteca própria com sessões completas que não aparecem no plano básico, organizadas por objetivo.</p><div className="objective-pills"><span>Técnica</span><span>Decisão</span><span>Finalização</span><span>Criatividade</span><span>Equipe</span><span>Coordenação</span></div><button onClick={() => setVipTool("library")}>Abrir biblioteca VIP <b>→</b></button></article>
        <article className="vip-challenge"><div className="vip-card-top"><span>🏆</span><small>56 DESAFIOS INÉDITOS</small></div><h3>7 dias de pé mágico</h3><p>Oito semanas de desafios exclusivos, progressivos e separados das +250 dinâmicas da biblioteca básica.</p><div className="week-row"><span className="done">S<br/><b>✓</b></span><span className="done">T<br/><b>✓</b></span><span className="today">Q<br/><b>3</b></span><span>Q<br/><b>4</b></span><span>S<br/><b>5</b></span><span>S<br/><b>6</b></span><span>D<br/><b>7</b></span></div><button onClick={() => setVipTool("challenges")}>Ver os 56 desafios <b>→</b></button></article>
      </div>
      <div className="vip-note"><span>✦</span><p><b>NOVO CONTEÚDO TODA SEMANA</b> Use os desafios para criar constância e os filtros para adaptar cada sessão ao nível da turma.</p></div>
    </section>

    <section className="how" id="como-usar"><span className="eyebrow">DO CELULAR PARA O CAMPO</span><h2>Três toques. Treino pronto.</h2><div><article><i>01</i><span>◎</span><h3>Escolha o objetivo</h3><p>Filtre pelo fundamento do treino.</p></article><article><i>02</i><span>▤</span><h3>Veja a dinâmica</h3><p>Diagrama e regras em uma tela.</p></article><article><i>03</i><span>▶</span><h3>Leve para o campo</h3><p>Abra o modo Reel e grave.</p></article></div></section>
    <footer><div className="brand"><span>⚽</span><div>FUTEBOL<small>EM JOGO</small></div></div><p>Treinos que viram memória.</p><b>+250 dinâmicas • acesso imediato</b></footer>
    {selected && <Detail drill={selected} onClose={() => setSelected(null)} />}{reel && <Detail drill={reel} reel onClose={() => setReel(null)} />}{bonusTool && <BonusTool tool={bonusTool} onClose={() => setBonusTool(null)} />}{vipTool && <VipTool tool={vipTool} onClose={() => setVipTool(null)} />}
  </main>;
}
