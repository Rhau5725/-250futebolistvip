"use client";

import { useMemo, useState } from "react";

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

export default function Home() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Drill | null>(null);
  const [reel, setReel] = useState<Drill | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [visible, setVisible] = useState(12);
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
        <article><i>01</i><div className="bonus-icon">⚡</div><small>BÔNUS 1</small><h3>Aquecimentos Prontos</h3><p>Exercícios rápidos para iniciar os treinos com mais organização, intensidade e preparação física.</p><ul><li>Ativação com bola</li><li>Rotinas de 5 a 10 minutos</li><li>Organização sem filas</li></ul></article>
        <article><i>02</i><div className="bonus-icon">🏅</div><small>BÔNUS 2</small><h3>Certificados de Craque</h3><p>Modelos de certificados para reconhecer a dedicação, evolução e participação dos atletas.</p><ul><li>Modelos prontos para imprimir</li><li>Reconhecimento por conquista</li><li>Mais motivação para a turma</li></ul></article>
        <article><i>03</i><div className="bonus-icon">▤</div><small>BÔNUS 3</small><h3>Organização de Treinos</h3><p>Aprenda a estruturar treinos mais eficientes, mantendo os atletas motivados do início ao fim.</p><ul><li>Roteiro completo de sessão</li><li>Divisão inteligente do tempo</li><li>Checklist do treinador</li></ul></article>
        <article><i>04</i><div className="bonus-icon">🚀</div><small>BÔNUS 4</small><h3>Agilidade e Velocidade</h3><p>Exercícios para desenvolver explosão, velocidade, coordenação e mudança de direção.</p><ul><li>Progressões por idade</li><li>Circuitos com poucos materiais</li><li>Desafios de reação</li></ul></article>
      </div>
    </section>

    <section className="vip-section" id="vip">
      <div className="vip-header"><span className="vip-lock">🔒</span><div><span className="eyebrow">ACESSO ESPECIAL DO TREINADOR</span><h2>Área VIP</h2><p>Planejamento contínuo para transformar atividades isoladas em uma temporada completa de evolução.</p></div><span className="vip-badge">MEMBRO VIP</span></div>
      <div className="vip-grid">
        <article className="vip-library"><div className="vip-card-top"><span>📚</span><small>BIBLIOTECA INTELIGENTE</small></div><h3>Treinos por objetivo</h3><p>Monte treinos completos em poucos minutos escolhendo exatamente a habilidade que deseja desenvolver.</p><div className="objective-pills"><span>Passe</span><span>Finalização</span><span>Drible</span><span>Posse</span><span>Coordenação</span><span>1x1</span></div><a href="#biblioteca">Abrir biblioteca <b>→</b></a></article>
        <article className="vip-challenge"><div className="vip-card-top"><span>🏆</span><small>DESAFIO DA SEMANA</small></div><h3>7 dias de pé mágico</h3><p>Desafios práticos para manter os atletas motivados, aumentar o engajamento e acompanhar a evolução técnica.</p><div className="week-row"><span className="done">S<br/><b>✓</b></span><span className="done">T<br/><b>✓</b></span><span className="today">Q<br/><b>3</b></span><span>Q<br/><b>4</b></span><span>S<br/><b>5</b></span><span>S<br/><b>6</b></span><span>D<br/><b>7</b></span></div><button onClick={() => setCategory("Domínio")}>Começar desafio <b>→</b></button></article>
      </div>
      <div className="vip-note"><span>✦</span><p><b>NOVO CONTEÚDO TODA SEMANA</b> Use os desafios para criar constância e os filtros para adaptar cada sessão ao nível da turma.</p></div>
    </section>

    <section className="how" id="como-usar"><span className="eyebrow">DO CELULAR PARA O CAMPO</span><h2>Três toques. Treino pronto.</h2><div><article><i>01</i><span>◎</span><h3>Escolha o objetivo</h3><p>Filtre pelo fundamento do treino.</p></article><article><i>02</i><span>▤</span><h3>Veja a dinâmica</h3><p>Diagrama e regras em uma tela.</p></article><article><i>03</i><span>▶</span><h3>Leve para o campo</h3><p>Abra o modo Reel e grave.</p></article></div></section>
    <footer><div className="brand"><span>⚽</span><div>FUTEBOL<small>EM JOGO</small></div></div><p>Treinos que viram memória.</p><b>+250 dinâmicas • acesso imediato</b></footer>
    {selected && <Detail drill={selected} onClose={() => setSelected(null)} />}{reel && <Detail drill={reel} reel onClose={() => setReel(null)} />}
  </main>;
}
