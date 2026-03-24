import { useState, useRef, useEffect } from "react";

const C = {
  olive: "#4E5A3E", oliveDk: "#4B5320", oliveLt: "#8FA65D",
  brown: "#7A4A34", brownDk: "#5C3626", brownLt: "#A0622D",
  cream: "#F3EDE2", creamLt: "#FAF7F2", creamDk: "#E8E0D2",
  mustard: "#C4952E", white: "#FFFFFF", dark: "#1C1C1C",
  charcoal: "#3A3A3A", gray: "#8A8578", grayLt: "#B8B1A5",
};
const KC = {
  olive: "#6B7C3E", oliveDk: "#4B5320", oliveLt: "#8FA65D",
  burnt: "#CC5500", burntDk: "#A0522D", burntLt: "#E87730",
  mustard: "#D4A017", mustardDk: "#B8860B", mustardLt: "#E8BF2C",
  bgOlive: "#EFF2E7", bgOrange: "#FDF0E3", bgMustard: "#FDF6E0",
  cream: "#FFFCF3", white: "#FFFFFF", dark: "#1C1C1C",
  charcoal: "#3A3A3A", gray: "#888888",
};

const ACCESS_CODE = "VISIONARY2026";

const TSMono = ({ size = 40, color = C.olive }) => (
  <svg width={size} height={size} viewBox="0 0 60 60"><text x="4" y="46" fontFamily="'Playfair Display', serif" fontSize="42" fontWeight="700" fill={color} letterSpacing="-3">TS</text></svg>
);

// ── Reusable assignment building blocks ──
const Field = ({ label, value, onChange, multi }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: KC.oliveDk, display: "block", marginBottom: 4 }}>{label}</label>
    {multi ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} style={{ width: "100%", border: `1.5px solid ${KC.olive}44`, borderRadius: 10, padding: "10px 12px", fontFamily: "'Nunito', sans-serif", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
    ) : (
      <input value={value || ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", border: `1.5px solid ${KC.olive}44`, borderRadius: 10, padding: "10px 12px", fontFamily: "'Nunito', sans-serif", fontSize: 14, boxSizing: "border-box" }} />
    )}
  </div>
);

const GridBoxes = ({ items, colors, values, onChange }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
    {items.map((item, i) => (
      <div key={i} style={{ background: [KC.bgOlive, KC.bgOrange, KC.bgMustard][i % 3], border: `2px solid ${colors[i % colors.length]}`, borderRadius: 12, padding: 12 }}>
        <label style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600, color: colors[i % colors.length], display: "block", marginBottom: 6 }}>{item}</label>
        <input value={(values && values[i]) || ""} onChange={e => { const v = [...(values || [])]; v[i] = e.target.value; onChange(v); }} placeholder="Type here..." style={{ width: "100%", border: `1px solid ${colors[i % colors.length]}44`, borderRadius: 8, padding: "8px 10px", fontFamily: "'Nunito', sans-serif", fontSize: 13, boxSizing: "border-box" }} />
      </div>
    ))}
  </div>
);

const SortActivity = ({ leftTitle, rightTitle, leftColor, rightColor, items, sorted, onSort }) => {
  const s = sorted || {};
  return (
    <div>
      {items.filter(Boolean).map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6, borderRadius: 8, background: s[item] === "left" ? KC.bgOlive : s[item] === "right" ? KC.bgOrange : KC.bgMustard, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600, color: KC.oliveDk, minWidth: 100 }}>{item}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[["left", leftTitle, leftColor], ["right", rightTitle, rightColor]].map(([key, label, col]) => (
              <button key={key} onClick={() => { const n = { ...s }; n[item] = key; onSort(n); }} style={{
                background: s[item] === key ? col : KC.white, color: s[item] === key ? KC.white : KC.charcoal,
                border: `1.5px solid ${col}`, borderRadius: 16, padding: "4px 14px",
                fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DrawingArea = ({ label = "Draw here:" }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600, color: KC.oliveDk, display: "block", marginBottom: 6 }}>{label}</label>
    <div style={{ background: KC.bgOlive, border: `3px solid ${KC.olive}`, borderRadius: 12, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: KC.gray }}>Use paper for this part — or describe what you'd draw below!</span>
    </div>
    <textarea placeholder="Describe your drawing..." rows={2} style={{ width: "100%", marginTop: 8, border: `1.5px solid ${KC.olive}44`, borderRadius: 10, padding: "10px 12px", fontFamily: "'Nunito', sans-serif", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
  </div>
);

const SectionHead = ({ title, color = KC.burnt }) => (
  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, color, margin: "20px 0 10px" }}>{title}</h3>
);

const Intro = ({ text }) => (
  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: KC.charcoal, lineHeight: 1.7, marginBottom: 16 }}>{text}</p>
);

const BonusBox = ({ children }) => (
  <div style={{ background: KC.bgMustard, border: `3px dashed ${KC.mustard}`, borderRadius: 16, padding: 24, marginTop: 20 }}>
    <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: KC.burnt, margin: "0 0 8px" }}>Bonus Challenge!</h3>
    {children}
  </div>
);

const RatingTable = ({ questions, values, onChange }) => (
  <div style={{ overflowX: "auto" }}>
    {questions.map((q, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${KC.olive}22` }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: KC.charcoal, flex: 1 }}>{q}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => { const v = [...(values||[])]; v[i]=n; onChange(v); }}
              style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${KC.olive}`, background: (values||[])[i]===n ? KC.olive : KC.white, color: (values||[])[i]===n ? KC.white : KC.olive, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>{n}</button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── All 24 assignments ──
const ASSIGNMENT_CONTENT = {
  1: { title: "Businesses Are Everywhere!", intro: "Did you know there are businesses all around you every single day? Restaurants, pet stores, barber shops, ice cream trucks. Today you're going on a Business Hunt!", sections: ["hunt", "sort", "favorite", "bonus1"] },
  2: { title: "Needs vs. Wants", intro: "Everything we buy falls into two groups: things we need (like food and clothes) and things we want (like toys and candy). Let's figure out the difference!", sections: ["sort_nw", "my_lists", "think", "bonus2"] },
  3: { title: "Goods and Services", intro: "Some businesses sell goods (things you can touch) and some sell services (things people do for you). Let's explore!", sections: ["identify", "roleplay", "bonus3"] },
  4: { title: "Meet an Entrepreneur", intro: "An entrepreneur is someone who starts their own business. Some entrepreneurs are kids just like you! Today you'll create your own trading card.", sections: ["facts", "card", "bonus4"] },
  5: { title: "Problems Are Opportunities!", intro: "Every great business starts with a problem that needs solving. The best entrepreneurs see problems everywhere and think 'I can fix that!'", sections: ["spot", "brainstorm", "draw_solution", "bonus5"] },
  6: { title: "Inventing a Product", intro: "Today you're an inventor! You're going to dream up a brand new product that solves a problem or makes life more fun.", sections: ["invention", "draw_inv", "sell_it", "bonus6"] },
  7: { title: "Inventing a Service", intro: "Not every business sells a thing you can hold. Some businesses sell services - helpful things people do for others. Today you'll create your own Service Menu!", sections: ["services_list", "menu_design", "bonus7"] },
  8: { title: "Pick Your Best Idea", intro: "You've brainstormed problems, invented products, and created services. Now it's time to pick your BEST idea and commit to it!", sections: ["top3", "rate", "passport", "bonus8"] },
  9: { title: "Coins and Bills Bootcamp", intro: "Money is how we buy and sell things. Today you'll become a Coins and Bills Expert!", sections: ["coins", "make_amount", "math", "bonus9"] },
  10: { title: "Earning & Saving", intro: "Smart business people know how to manage their money. Today you'll learn the SPEND, SAVE, GIVE system!", sections: ["jars", "goal", "design_jars", "bonus10"] },
  11: { title: "What Things Cost", intro: "Business owners have to decide what to charge. Too high and nobody buys. Too low and you don't make money. Let's practice pricing!", sections: ["guess", "set_price", "bonus11"] },
  12: { title: "Profit = Income - Costs", intro: "The most important math in business: Profit = Income - Costs. If you earn more than you spend, you make a profit!", sections: ["costs", "income", "profit", "bonus12"] },
  13: { title: "What Is a Brand?", intro: "A brand is how people recognize your business. Think about the golden arches or the apple with a bite. Today you'll create YOUR brand!", sections: ["logo_hunt", "design_logo", "bonus13"] },
  14: { title: "Advertising 101", intro: "Advertising is how businesses tell people about what they sell. Today you'll make your own ad poster and practice your commercial!", sections: ["plan_ad", "poster", "commercial", "bonus14"] },
  15: { title: "Know Your Customer", intro: "The best businesses know exactly who their customer is. Today you'll create a character based on your perfect customer!", sections: ["ideal", "draw_customer", "bonus15"] },
  16: { title: "The Art of the Sale", intro: "Selling is about connecting with people and helping them see why they need what you're offering. Today you'll practice the art of the sale!", sections: ["skills", "pitch", "bonus16"] },
  17: { title: "Business Plan on a Page", intro: "Every great business starts with a plan. Today you'll fill out your Business Plan on a Page!", sections: ["plan", "logo_plan", "mission", "bonus17"] },
  18: { title: "Supplies & Setup", intro: "Before you open for business, you need supplies! Today you'll make a shopping list and figure out your startup cost.", sections: ["supply_list", "do_math", "bonus18"] },
  19: { title: "Practice Run!", intro: "Before your big launch, it's smart to do a practice run! Today you'll test your business with your family.", sections: ["soft_plan", "setup_sketch", "after", "bonus19"] },
  20: { title: "Grand Opening Day", intro: "TODAY IS THE DAY! Your Grand Opening! Time to open your mini business for real customers!", sections: ["checklist", "sales_tracker", "reflect20", "bonus20"] },
  21: { title: "Count Your Profits", intro: "Time to do the math! Let's find out if your business made a profit!", sections: ["ledger", "calculate", "reflect21", "bonus21"] },
  22: { title: "Customer Feedback", intro: "Great businesses listen to their customers. Today you'll create a customer survey and learn from the feedback!", sections: ["survey", "collect", "learned", "bonus22"] },
  23: { title: "Giving Back", intro: "One of the most important things an entrepreneur can do is give back. Today you'll pick a cause and plan a donation!", sections: ["causes", "giving_plan", "thank_you", "bonus23"] },
  24: { title: "Graduation & Reflection", intro: "YOU DID IT! You completed The Little Visionaries program! Today is your graduation.", sections: ["what_learned", "fav_memory", "future", "certificate"] },
};

function AssignmentView({ week, onBack, data, setData }) {
  const a = ASSIGNMENT_CONTENT[week];
  if (!a) return null;
  const d = data[week] || {};
  const update = (key, val) => setData(prev => ({ ...prev, [week]: { ...(prev[week]||{}), [key]: val } }));
  const [submitted, setSubmitted] = useState(false);

  const renderSection = (sec) => {
    switch(sec) {
      case "hunt": return (<><SectionHead title="Part 1: Business Scavenger Hunt" /><Intro text="Write the businesses you find! Try to find at least 6." /><GridBoxes items={["Business #1","Business #2","Business #3","Business #4","Business #5","Business #6"]} colors={[KC.olive, KC.burnt, KC.mustard]} values={d.hunt} onChange={v=>update("hunt",v)} /></>);
      case "sort": return (<><SectionHead title="Part 2: Sort Them Out!" /><Intro text="For each business you found, is it goods (sells things) or services (does things)?" /><SortActivity leftTitle="Sells Things" rightTitle="Does Things" leftColor={KC.olive} rightColor={KC.burnt} items={(d.hunt||[]).filter(Boolean)} sorted={d.sort} onSort={v=>update("sort",v)} /></>);
      case "favorite": return (<><SectionHead title="Part 3: My Favorite Business" /><Field label="What is the name of the business?" value={d.fav1} onChange={v=>update("fav1",v)} /><Field label="What does it sell or do?" value={d.fav2} onChange={v=>update("fav2",v)} /><Field label="Who are its customers?" value={d.fav3} onChange={v=>update("fav3",v)} /><Field label="Why do you like this business?" value={d.fav4} onChange={v=>update("fav4",v)} multi /></>);
      case "bonus1": return (<BonusBox><Field label="If YOU could open any business, what would it be?" value={d.bonus} onChange={v=>update("bonus",v)} /><DrawingArea label="Draw your business logo!" /></BonusBox>);
      case "sort_nw": return (<><SectionHead title="Part 1: Needs vs. Wants Sort" /><Intro text="Sort these items: Water, Video Games, Shoes, Candy, A Warm Coat, A Bicycle, Medicine, Stickers, Lunch, A Puppy" /><SortActivity leftTitle="Needs" rightTitle="Wants" leftColor={KC.olive} rightColor={KC.burnt} items={["Water","Video Games","Shoes","Candy","A Warm Coat","A Bicycle","Medicine","Stickers","Lunch","A Puppy"]} sorted={d.nw_sort} onSort={v=>update("nw_sort",v)} /></>);
      case "my_lists": return (<><SectionHead title="Part 2: My Own Lists" /><Field label="3 things I NEED:" value={d.needs} onChange={v=>update("needs",v)} /><Field label="3 things I WANT:" value={d.wants} onChange={v=>update("wants",v)} /></>);
      case "think": return (<><SectionHead title="Part 3: Think About It" /><Field label="Can a want ever become a need? Give an example." value={d.think1} onChange={v=>update("think1",v)} multi /><Field label="Why do businesses need to know what people need vs. want?" value={d.think2} onChange={v=>update("think2",v)} multi /></>);
      case "bonus2": return (<BonusBox><Intro text="Draw a poster with two sides: NEEDS on one side and WANTS on the other!" /><DrawingArea label="My Needs vs. Wants poster" /></BonusBox>);
      case "identify": return (<><SectionHead title="Part 1: Goods or Services?" /><Intro text="For each business, choose: does it sell GOODS or provide SERVICES?" /><SortActivity leftTitle="Goods" rightTitle="Services" leftColor={KC.olive} rightColor={KC.burnt} items={["Bakery","Dog Walker","Toy Store","Dentist","Lemonade Stand","Piano Teacher","Flower Shop","House Cleaner"]} sorted={d.gs_sort} onSort={v=>update("gs_sort",v)} /></>);
      case "roleplay": return (<><SectionHead title="Part 2: Role-Play Time!" /><Intro text="Pretend you run TWO businesses:" /><h4 style={{fontFamily:"'Fredoka',sans-serif",fontSize:16,color:KC.olive,margin:"12px 0 6px"}}>My Goods Business</h4><Field label="What is it called?" value={d.g_name} onChange={v=>update("g_name",v)} /><Field label="What do you sell?" value={d.g_sell} onChange={v=>update("g_sell",v)} /><Field label="How much does it cost?" value={d.g_cost} onChange={v=>update("g_cost",v)} /><h4 style={{fontFamily:"'Fredoka',sans-serif",fontSize:16,color:KC.burnt,margin:"12px 0 6px"}}>My Services Business</h4><Field label="What is it called?" value={d.s_name} onChange={v=>update("s_name",v)} /><Field label="What service do you provide?" value={d.s_service} onChange={v=>update("s_service",v)} /><Field label="How much do you charge?" value={d.s_cost} onChange={v=>update("s_cost",v)} /></>);
      case "bonus3": return (<BonusBox><Field label="Can you think of a business that sells BOTH goods AND services? Explain:" value={d.bonus3} onChange={v=>update("bonus3",v)} multi /></BonusBox>);
      case "facts": return (<><SectionHead title="Part 1: Entrepreneur Facts" /><Field label="What does 'entrepreneur' mean in your own words?" value={d.def} onChange={v=>update("def",v)} multi /><Field label="Name one entrepreneur you've heard of:" value={d.ent_name} onChange={v=>update("ent_name",v)} /><Field label="What did they create or build?" value={d.ent_built} onChange={v=>update("ent_built",v)} /><Field label="What made them successful?" value={d.ent_why} onChange={v=>update("ent_why",v)} multi /></>);
      case "card": return (<><SectionHead title="Part 2: Entrepreneur Trading Card" /><DrawingArea label="Design a trading card for an entrepreneur you admire!" /><Field label="Name:" value={d.card_name} onChange={v=>update("card_name",v)} /><Field label="Business:" value={d.card_biz} onChange={v=>update("card_biz",v)} /><Field label="Superpower:" value={d.card_power} onChange={v=>update("card_power",v)} /><Field label="Fun Fact:" value={d.card_fact} onChange={v=>update("card_fact",v)} /></>);
      case "bonus4": return (<BonusBox><Field label="Make a trading card for YOURSELF as a future entrepreneur! My Business:" value={d.my_biz} onChange={v=>update("my_biz",v)} /><Field label="My Superpower:" value={d.my_power} onChange={v=>update("my_power",v)} /></BonusBox>);
      case "spot": return (<><SectionHead title="Part 1: Problem Spotter" /><Intro text="List 5 problems you notice at home, school, or in your neighborhood:" /><GridBoxes items={["Problem #1","Problem #2","Problem #3","Problem #4","Problem #5"]} colors={[KC.olive, KC.burnt, KC.mustard]} values={d.problems} onChange={v=>update("problems",v)} /></>);
      case "brainstorm": return (<><SectionHead title="Part 2: Solution Brainstorm" /><Field label="Pick your favorite problem from above:" value={d.pick_prob} onChange={v=>update("pick_prob",v)} /><Field label="Silly Solution:" value={d.silly} onChange={v=>update("silly",v)} /><Field label="Serious Solution:" value={d.serious} onChange={v=>update("serious",v)} /></>);
      case "draw_solution": return (<><SectionHead title="Part 3: Draw Your Solution" /><DrawingArea label="Draw your serious solution in action:" /></>);
      case "bonus5": return (<BonusBox><Intro text="Ask 3 family members what problems annoy them:" /><Field label="Person 1's problem:" value={d.fam1} onChange={v=>update("fam1",v)} /><Field label="Person 2's problem:" value={d.fam2} onChange={v=>update("fam2",v)} /><Field label="Person 3's problem:" value={d.fam3} onChange={v=>update("fam3",v)} /></BonusBox>);
      case "invention": return (<><SectionHead title="Part 1: My Invention" /><Field label="What is your invention called?" value={d.inv_name} onChange={v=>update("inv_name",v)} /><Field label="What problem does it solve?" value={d.inv_prob} onChange={v=>update("inv_prob",v)} /><Field label="Who would buy it?" value={d.inv_who} onChange={v=>update("inv_who",v)} /><Field label="How much would it cost?" value={d.inv_cost} onChange={v=>update("inv_cost",v)} /></>);
      case "draw_inv": return (<><SectionHead title="Part 2: Draw Your Invention" /><DrawingArea label="Draw your invention with labels:" /></>);
      case "sell_it": return (<><SectionHead title="Part 3: Sell It!" /><Field label="Write a short description to convince someone to buy it:" value={d.pitch} onChange={v=>update("pitch",v)} multi /></>);
      case "bonus6": return (<BonusBox><Field label="What materials would you need? List them:" value={d.materials} onChange={v=>update("materials",v)} multi /></BonusBox>);
      case "services_list": return (<><SectionHead title="Part 1: Services I Could Offer" /><Intro text="Think of helpful things you could do for neighbors, family, or friends:" /><GridBoxes items={["Service #1","Service #2","Service #3","Service #4","Service #5"]} colors={[KC.olive, KC.burnt, KC.mustard]} values={d.services} onChange={v=>update("services",v)} /></>);
      case "menu_design": return (<><SectionHead title="Part 2: My Service Menu" /><DrawingArea label="Design a menu showing your services and prices:" /></>);
      case "bonus7": return (<BonusBox><Field label="Who did you offer your service to?" value={d.offered_to} onChange={v=>update("offered_to",v)} /><Field label="Did they say yes?" value={d.said_yes} onChange={v=>update("said_yes",v)} /><Field label="What did you learn?" value={d.learned7} onChange={v=>update("learned7",v)} multi /></BonusBox>);
      case "top3": return (<><SectionHead title="Part 1: My Top 3 Ideas" /><GridBoxes items={["Idea #1","Idea #2","Idea #3"]} colors={[KC.olive, KC.burnt, KC.mustard]} values={d.ideas} onChange={v=>update("ideas",v)} /></>);
      case "rate": return (<><SectionHead title="Part 2: Rate Your Ideas" /><Intro text="For each question, rate each idea 1-5:" /><RatingTable questions={["Is it fun?","Can I actually make/do it?","Would people pay for it?","Am I excited about it?"]} values={d.ratings} onChange={v=>update("ratings",v)} /></>);
      case "passport": return (<><SectionHead title="Part 3: My Idea Passport" /><Field label="THE WINNER IS:" value={d.winner} onChange={v=>update("winner",v)} /><Field label="Why did you pick this one?" value={d.why_pick} onChange={v=>update("why_pick",v)} multi /><Field label="Who will your customers be?" value={d.customers} onChange={v=>update("customers",v)} /><Field label="What will you call your business?" value={d.biz_name} onChange={v=>update("biz_name",v)} /></>);
      case "bonus8": return (<BonusBox><Field label="Present your idea to family! Write their feedback:" value={d.feedback8} onChange={v=>update("feedback8",v)} multi /></BonusBox>);
      case "coins": return (<><SectionHead title="Part 1: Know Your Coins" />{["Penny","Nickel","Dime","Quarter","Half Dollar"].map(c=><Field key={c} label={`${c} = how much?`} value={d[`coin_${c}`]} onChange={v=>update(`coin_${c}`,v)} />)}</>);
      case "make_amount": return (<><SectionHead title="Part 2: Make the Amount" /><Intro text="Using the FEWEST coins, how do you make:" />{["$0.37","$0.68","$1.15","$0.99"].map(a=><Field key={a} label={`${a} =`} value={d[`amt_${a}`]} onChange={v=>update(`amt_${a}`,v)} />)}</>);
      case "math": return (<><SectionHead title="Part 3: Money Math" />{["3 quarters + 2 dimes = ?","1 dollar + 3 quarters = ?","5 dimes + 5 nickels = ?","$2.00 - $0.75 = ?"].map((p,i)=><Field key={i} label={p} value={d[`math${i}`]} onChange={v=>update(`math${i}`,v)} />)}</>);
      case "bonus9": return (<BonusBox><Field label="Go on a coin hunt! How much did you find?" value={d.found} onChange={v=>update("found",v)} /></BonusBox>);
      case "jars": return (<><SectionHead title="Part 1: Three Jars" /><Intro text="Imagine you earned $10. How would you split it?" /><Field label="SPEND jar: $" value={d.spend} onChange={v=>update("spend",v)} /><Field label="SAVE jar: $" value={d.save} onChange={v=>update("save",v)} /><Field label="GIVE jar: $" value={d.give} onChange={v=>update("give",v)} /></>);
      case "goal": return (<><SectionHead title="Part 2: My Savings Goal" /><Field label="What are you saving up for?" value={d.saving_for} onChange={v=>update("saving_for",v)} /><Field label="How much does it cost?" value={d.goal_cost} onChange={v=>update("goal_cost",v)} /><Field label="How long will it take to save?" value={d.how_long} onChange={v=>update("how_long",v)} /></>);
      case "design_jars": return (<><SectionHead title="Part 3: Decorate Your Jars" /><DrawingArea label="Design labels for your SPEND, SAVE, and GIVE jars:" /></>);
      case "bonus10": return (<BonusBox><Intro text="Make your jars for real! Decorate 3 jars or envelopes and start using them this week." /></BonusBox>);
      case "guess": return (<><SectionHead title="Part 1: Price Guessing Game" /><Intro text="Guess the price, then look it up!" />{["A gallon of milk","A loaf of bread","A kids' meal","A movie ticket","Sneakers","A haircut"].map(i=><div key={i} style={{display:"flex",gap:10,marginBottom:8,flexWrap:"wrap"}}><span style={{fontFamily:"'Nunito',sans-serif",fontSize:14,minWidth:140,color:KC.charcoal}}>{i}</span><input placeholder="My guess $" value={d[`g_${i}`]||""} onChange={e=>update(`g_${i}`,e.target.value)} style={{flex:1,minWidth:80,border:`1px solid ${KC.olive}44`,borderRadius:8,padding:"6px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /><input placeholder="Real price $" value={d[`r_${i}`]||""} onChange={e=>update(`r_${i}`,e.target.value)} style={{flex:1,minWidth:80,border:`1px solid ${KC.burnt}44`,borderRadius:8,padding:"6px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /></div>)}</>);
      case "set_price": return (<><SectionHead title="Part 2: Set Your Price" /><Field label="What are you selling?" value={d.selling} onChange={v=>update("selling",v)} /><Field label="How much does it cost YOU to make?" value={d.my_cost} onChange={v=>update("my_cost",v)} /><Field label="What will you charge?" value={d.my_price} onChange={v=>update("my_price",v)} /><Field label="Why did you pick that price?" value={d.why_price} onChange={v=>update("why_price",v)} multi /></>);
      case "bonus11": return (<BonusBox><Field label="Visit a store! Write 5 items and their prices:" value={d.store_visit} onChange={v=>update("store_visit",v)} multi /></BonusBox>);
      case "costs": return (<><SectionHead title="Part 1: Lemonade Stand Costs" /><Intro text="Add up your costs:" /><Field label="Lemons ($3), Sugar ($1), Cups ($2), Sign ($1) = TOTAL:" value={d.total_cost} onChange={v=>update("total_cost",v)} /></>);
      case "income": return (<><SectionHead title="Part 2: Income" /><Intro text="You sell each cup for $1.00. You sell 15 cups." /><Field label="Total Income (15 x $1.00) = $" value={d.income} onChange={v=>update("income",v)} /></>);
      case "profit": return (<><SectionHead title="Part 3: Calculate Profit!" /><Field label="Income $ minus Costs $ = PROFIT $" value={d.profit} onChange={v=>update("profit",v)} /><Field label="Did you make a profit?" value={d.made_profit} onChange={v=>update("made_profit",v)} /><Field label="What could you do to make MORE profit?" value={d.more_profit} onChange={v=>update("more_profit",v)} multi /></>);
      case "bonus12": return (<BonusBox><Field label="Do the math for YOUR business! Costs, Price, Profit:" value={d.my_math} onChange={v=>update("my_math",v)} multi /></BonusBox>);
      case "logo_hunt": return (<><SectionHead title="Part 1: Logo Scavenger Hunt" /><Intro text="Draw or describe 4 logos you recognize:" /><GridBoxes items={["Logo #1","Logo #2","Logo #3","Logo #4"]} colors={[KC.olive, KC.burnt, KC.mustard, KC.olive]} values={d.logos} onChange={v=>update("logos",v)} /></>);
      case "design_logo": return (<><SectionHead title="Part 2: Design Your Logo" /><DrawingArea label="Create a logo for YOUR business!" /><Field label="What colors did you use and why?" value={d.logo_colors} onChange={v=>update("logo_colors",v)} multi /></>);
      case "bonus13": return (<BonusBox><Field label="Design a second version! Which did people vote for?" value={d.logo_vote} onChange={v=>update("logo_vote",v)} /></BonusBox>);
      case "plan_ad": return (<><SectionHead title="Part 1: Plan Your Ad" /><Field label="What are you advertising?" value={d.ad_what} onChange={v=>update("ad_what",v)} /><Field label="What makes it special?" value={d.ad_special} onChange={v=>update("ad_special",v)} /><Field label="Who do you want to see this ad?" value={d.ad_who} onChange={v=>update("ad_who",v)} /></>);
      case "poster": return (<><SectionHead title="Part 2: Design Your Poster" /><DrawingArea label="Create a colorful ad poster:" /></>);
      case "commercial": return (<><SectionHead title="Part 3: My 15-Second Commercial" /><Field label="Write your commercial script:" value={d.commercial} onChange={v=>update("commercial",v)} multi /></>);
      case "bonus14": return (<BonusBox><Field label="Record your commercial! What would you change after watching it?" value={d.record} onChange={v=>update("record",v)} multi /></BonusBox>);
      case "ideal": return (<><SectionHead title="Part 1: My Ideal Customer" /><Field label="Are they a kid, teenager, or grown-up?" value={d.cust_age} onChange={v=>update("cust_age",v)} /><Field label="What do they like to do for fun?" value={d.cust_fun} onChange={v=>update("cust_fun",v)} /><Field label="What problems do they have that YOUR business can solve?" value={d.cust_prob} onChange={v=>update("cust_prob",v)} multi /><Field label="Where do they hang out?" value={d.cust_where} onChange={v=>update("cust_where",v)} /></>);
      case "draw_customer": return (<><SectionHead title="Part 2: Draw Your Customer" /><DrawingArea label="Draw your ideal customer as a character!" /><Field label="Customer Name:" value={d.cust_name} onChange={v=>update("cust_name",v)} /></>);
      case "bonus15": return (<BonusBox><Field label="Think of a SECOND type of customer. How are they different?" value={d.cust2} onChange={v=>update("cust2",v)} multi /></BonusBox>);
      case "skills": return (<><SectionHead title="Part 1: Selling Skills" /><Intro text="Rate yourself 1-5 on each skill:" /><RatingTable questions={["Smiling and being friendly","Looking people in the eye","Speaking clearly","Being excited about my product","Answering questions","Saying thank you"]} values={d.skills} onChange={v=>update("skills",v)} /></>);
      case "pitch": return (<><SectionHead title="Part 2: Practice Your Pitch" /><Field label="Write your sales pitch:" value={d.pitch16} onChange={v=>update("pitch16",v)} multi /><Field label="Person 1 feedback:" value={d.fb1} onChange={v=>update("fb1",v)} /><Field label="Person 2 feedback:" value={d.fb2} onChange={v=>update("fb2",v)} /><Field label="Person 3 feedback:" value={d.fb3} onChange={v=>update("fb3",v)} /></>);
      case "bonus16": return (<BonusBox><Field label="What's one thing you'll do differently next time?" value={d.improve16} onChange={v=>update("improve16",v)} multi /></BonusBox>);
      case "plan": return (<><SectionHead title="My Business Plan" />{[["Business Name","bp_name"],["What I sell or do","bp_what"],["My customers are","bp_cust"],["My price","bp_price"],["What makes me different","bp_diff"],["My startup costs","bp_costs"],["Where I will sell","bp_where"],["My business goal","bp_goal"]].map(([l,k])=><Field key={k} label={l} value={d[k]} onChange={v=>update(k,v)} />)}</>);
      case "logo_plan": return (<><SectionHead title="My Business Logo" /><DrawingArea label="Draw your business logo:" /></>);
      case "mission": return (<><SectionHead title="My Mission Statement" /><Field label="Why does your business exist? What do you want people to feel?" value={d.mission} onChange={v=>update("mission",v)} multi /></>);
      case "bonus17": return (<BonusBox><Field label="Have a parent sign as your first 'investor'! Their name:" value={d.investor} onChange={v=>update("investor",v)} /></BonusBox>);
      case "supply_list": return (<><SectionHead title="Part 1: My Supply List" />{[1,2,3,4,5,6].map(i=><div key={i} style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}><input placeholder={`Item ${i}`} value={d[`item${i}`]||""} onChange={e=>update(`item${i}`,e.target.value)} style={{flex:2,minWidth:120,border:`1px solid ${KC.olive}44`,borderRadius:8,padding:"8px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /><input placeholder="Cost $" value={d[`cost${i}`]||""} onChange={e=>update(`cost${i}`,e.target.value)} style={{flex:1,minWidth:60,border:`1px solid ${KC.olive}44`,borderRadius:8,padding:"8px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /></div>)}<Field label="TOTAL STARTUP COST: $" value={d.total18} onChange={v=>update("total18",v)} /></>);
      case "do_math": return (<><SectionHead title="Part 2: Do the Math" /><Field label="How much money do you need to start?" value={d.need18} onChange={v=>update("need18",v)} /><Field label="How many items to sell to make it back?" value={d.breakeven} onChange={v=>update("breakeven",v)} /></>);
      case "bonus18": return (<BonusBox><Intro text="Go shopping (for real or pretend) with a parent and check off items!" /></BonusBox>);
      case "soft_plan": return (<><SectionHead title="Part 1: Soft Launch Plan" /><Field label="What will you sell today?" value={d.sell19} onChange={v=>update("sell19",v)} /><Field label="Where will you set up?" value={d.where19} onChange={v=>update("where19",v)} /><Field label="What time will you open?" value={d.time19} onChange={v=>update("time19",v)} /></>);
      case "setup_sketch": return (<><SectionHead title="Part 2: Setup Sketch" /><DrawingArea label="Draw how your booth/table will look:" /></>);
      case "after": return (<><SectionHead title="Part 3: After the Practice Run" /><Field label="How many customers did you serve?" value={d.served} onChange={v=>update("served",v)} /><Field label="What went really well?" value={d.well19} onChange={v=>update("well19",v)} multi /><Field label="What will you change for the real launch?" value={d.change19} onChange={v=>update("change19",v)} multi /></>);
      case "bonus19": return (<BonusBox><Field label="Family member 1: ___ stars. Tip:" value={d.tip1} onChange={v=>update("tip1",v)} /><Field label="Family member 2: ___ stars. Tip:" value={d.tip2} onChange={v=>update("tip2",v)} /><Field label="Family member 3: ___ stars. Tip:" value={d.tip3} onChange={v=>update("tip3",v)} /></BonusBox>);
      case "checklist": return (<><SectionHead title="Part 1: Grand Opening Checklist" />{["Supplies are ready","Products are made","Price signs are up","Sales pitch is practiced","I have change","My smile is ON"].map(c=><label key={c} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",fontFamily:"'Nunito',sans-serif",fontSize:14,color:KC.charcoal,cursor:"pointer"}}><input type="checkbox" checked={d[`ck_${c}`]||false} onChange={e=>update(`ck_${c}`,e.target.checked)} style={{width:20,height:20}} />{c}</label>)}</>);
      case "sales_tracker": return (<><SectionHead title="Part 2: Sales Tracker" />{[1,2,3,4,5,6].map(i=><div key={i} style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}><input placeholder={`Customer ${i}`} value={d[`cust${i}`]||""} onChange={e=>update(`cust${i}`,e.target.value)} style={{flex:2,minWidth:100,border:`1px solid ${KC.burnt}44`,borderRadius:8,padding:"8px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /><input placeholder="What they bought" value={d[`bought${i}`]||""} onChange={e=>update(`bought${i}`,e.target.value)} style={{flex:2,minWidth:100,border:`1px solid ${KC.burnt}44`,borderRadius:8,padding:"8px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /><input placeholder="$ paid" value={d[`paid${i}`]||""} onChange={e=>update(`paid${i}`,e.target.value)} style={{flex:1,minWidth:60,border:`1px solid ${KC.burnt}44`,borderRadius:8,padding:"8px 10px",fontFamily:"'Nunito',sans-serif",fontSize:13}} /></div>)}<Field label="TOTAL SALES: $" value={d.total_sales} onChange={v=>update("total_sales",v)} /></>);
      case "reflect20": return (<><SectionHead title="Part 3: How Did It Go?" /><Field label="Best moment?" value={d.best20} onChange={v=>update("best20",v)} multi /><Field label="What would you do differently?" value={d.diff20} onChange={v=>update("diff20",v)} multi /></>);
      case "bonus20": return (<BonusBox><Intro text="Take a photo of your business setup! Share it with family." /></BonusBox>);
      case "ledger": return (<><SectionHead title="Part 1: My Business Ledger" /><Field label="Total Sales (Income): $" value={d.inc21} onChange={v=>update("inc21",v)} /><Field label="Total Startup Costs: $" value={d.cost21} onChange={v=>update("cost21",v)} /><Field label="Any extra costs: $" value={d.extra21} onChange={v=>update("extra21",v)} /></>);
      case "calculate": return (<><SectionHead title="Part 2: The Big Calculation" /><div style={{background:KC.bgMustard,border:`3px solid ${KC.mustard}`,borderRadius:12,padding:20,textAlign:"center",margin:"12px 0"}}><span style={{fontFamily:"'Fredoka',sans-serif",fontSize:18,color:KC.oliveDk}}>Income $ <input value={d.calc_inc||""} onChange={e=>update("calc_inc",e.target.value)} style={{width:60,textAlign:"center",border:`2px solid ${KC.mustard}`,borderRadius:6,padding:4,fontSize:16}} /> minus Costs $ <input value={d.calc_cost||""} onChange={e=>update("calc_cost",e.target.value)} style={{width:60,textAlign:"center",border:`2px solid ${KC.mustard}`,borderRadius:6,padding:4,fontSize:16}} /> = PROFIT $ <input value={d.calc_profit||""} onChange={e=>update("calc_profit",e.target.value)} style={{width:60,textAlign:"center",border:`2px solid ${KC.olive}`,borderRadius:6,padding:4,fontSize:16,fontWeight:700}} /></span></div></>);
      case "reflect21": return (<><SectionHead title="Part 3: Reflect" /><Field label="Did you make a profit, break even, or lose money?" value={d.result21} onChange={v=>update("result21",v)} /><Field label="How does that feel?" value={d.feel21} onChange={v=>update("feel21",v)} multi /></>);
      case "bonus21": return (<BonusBox><Intro text="Split your profit into your 3 jars!" /><Field label="SPEND: $" value={d.sp21} onChange={v=>update("sp21",v)} /><Field label="SAVE: $" value={d.sv21} onChange={v=>update("sv21",v)} /><Field label="GIVE: $" value={d.gv21} onChange={v=>update("gv21",v)} /></BonusBox>);
      case "survey": return (<><SectionHead title="Part 1: Create Your Survey" /><Intro text="Write 5 questions to ask your customers:" />{[1,2,3,4,5].map(i=><Field key={i} label={`Question ${i}:`} value={d[`q${i}`]} onChange={v=>update(`q${i}`,v)} />)}</>);
      case "collect": return (<><SectionHead title="Part 2: Collect Answers" />{[1,2,3].map(i=><div key={i}><Field label={`Person ${i} name:`} value={d[`p${i}_name`]} onChange={v=>update(`p${i}_name`,v)} /><Field label={`Their answers:`} value={d[`p${i}_ans`]} onChange={v=>update(`p${i}_ans`,v)} multi /></div>)}</>);
      case "learned": return (<><SectionHead title="Part 3: What I Learned" /><Field label="What did people love?" value={d.loved} onChange={v=>update("loved",v)} multi /><Field label="What's one thing to improve?" value={d.improve22} onChange={v=>update("improve22",v)} multi /></>);
      case "bonus22": return (<BonusBox><Field label="Give your survey a fun name!" value={d.survey_name} onChange={v=>update("survey_name",v)} /></BonusBox>);
      case "causes": return (<><SectionHead title="Part 1: Causes I Care About" /><Field label="List things you care about (animals, environment, etc.):" value={d.causes} onChange={v=>update("causes",v)} multi /></>);
      case "giving_plan": return (<><SectionHead title="Part 2: My Giving Plan" /><Field label="Which cause did you choose?" value={d.cause_pick} onChange={v=>update("cause_pick",v)} /><Field label="How much will you donate?" value={d.donate_amt} onChange={v=>update("donate_amt",v)} /><Field label="Why does this cause matter to you?" value={d.cause_why} onChange={v=>update("cause_why",v)} multi /></>);
      case "thank_you": return (<><SectionHead title="Part 3: Thank You Card" /><DrawingArea label="Design a thank-you card for someone who supported your business:" /></>);
      case "bonus23": return (<BonusBox><Field label="Write a letter to the organization you're donating to:" value={d.letter23} onChange={v=>update("letter23",v)} multi /></BonusBox>);
      case "what_learned": return (<><SectionHead title="Part 1: What I Learned" /><Field label="What is a business?" value={d.wl1} onChange={v=>update("wl1",v)} multi /><Field label="What's the difference between goods and services?" value={d.wl2} onChange={v=>update("wl2",v)} /><Field label="What does 'profit' mean?" value={d.wl3} onChange={v=>update("wl3",v)} /><Field label="What was the hardest part?" value={d.wl4} onChange={v=>update("wl4",v)} multi /><Field label="What was the most fun?" value={d.wl5} onChange={v=>update("wl5",v)} multi /><Field label="What would you tell another kid who wants to start a business?" value={d.wl6} onChange={v=>update("wl6",v)} multi /></>);
      case "fav_memory": return (<><SectionHead title="Part 2: My Favorite Memory" /><DrawingArea label="Draw or describe your favorite moment:" /></>);
      case "future": return (<><SectionHead title="Part 3: My Future" /><Field label="What business do you want when you grow up?" value={d.future_biz} onChange={v=>update("future_biz",v)} /><Field label="What skill will you keep practicing?" value={d.future_skill} onChange={v=>update("future_skill",v)} /><Field label="What is your biggest dream?" value={d.dream} onChange={v=>update("dream",v)} multi /></>);
      case "certificate": return (<div style={{background:KC.bgMustard,border:`3px solid ${KC.mustard}`,borderRadius:16,padding:36,textAlign:"center",marginTop:20}}><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:14,letterSpacing:3,color:KC.mustardDk,textTransform:"uppercase"}}>Certificate of Completion</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:28,color:KC.oliveDk,margin:"16px 0 4px"}}>The Little Visionaries</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:14,color:KC.burnt}}>Business School for Future Moguls</div><div style={{fontFamily:"'Nunito',sans-serif",fontSize:16,color:KC.charcoal,margin:"20px 0"}}>This certifies that</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:24,color:KC.oliveDk,borderBottom:`2px solid ${KC.mustard}`,display:"inline-block",padding:"4px 40px"}}>{d.grad_name||"_______________"}</div><Field label="" value={d.grad_name} onChange={v=>update("grad_name",v)} /><div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:KC.gray,marginTop:12}}>by The Visionary Architect</div></div>);
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: `1.5px solid ${KC.olive}`, borderRadius: 20, padding: "8px 20px", fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 600, color: KC.olive, cursor: "pointer", marginBottom: 16 }}>Back to Curriculum</button>
      <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, color: KC.oliveDk, margin: "0 0 4px" }}>Assignment {week}</h2>
      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, color: KC.burnt, margin: "0 0 4px" }}>{a.title}</h3>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: KC.mustardDk, fontStyle: "italic", margin: "0 0 16px" }}>The Little Visionaries | by The Visionary Architect</p>
      <div style={{ background: KC.white, borderRadius: 20, padding: 28, border: `2px solid ${KC.olive}33` }}>
        <Intro text={a.intro} />
        {a.sections.map((sec, i) => <div key={i}>{renderSection(sec)}</div>)}
      </div>
      {!submitted ? (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setSubmitted(true)} style={{ background: KC.burnt, color: KC.white, border: "none", borderRadius: 28, padding: "14px 40px", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(204,85,0,0.3)" }}>Complete Assignment</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: 24, background: KC.bgOlive, border: `3px solid ${KC.olive}`, borderRadius: 20, padding: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>&#11088;</div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, color: KC.oliveDk, fontWeight: 700 }}>Amazing work, Little Visionary!</div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: KC.charcoal, marginTop: 8 }}>Show your answers to a parent and talk about what you discovered!</p>
        </div>
      )}
    </div>
  );
}

// ── Units data ──
const UNITS = [
  { num:1, title:"What Is a Business?", color:KC.olive, bg:KC.bgOlive, weeks:[{wk:1,topic:"Businesses Are Everywhere!",activity:"Neighborhood walk - spot & sketch businesses"},{wk:2,topic:"Needs vs. Wants",activity:"Sort items into needs & wants"},{wk:3,topic:"Goods and Services",activity:"Role-play two different businesses"},{wk:4,topic:"Meet an Entrepreneur",activity:"Create an Entrepreneur Trading Card"}]},
  { num:2, title:"The Big Idea Factory", color:KC.burnt, bg:KC.bgOrange, weeks:[{wk:5,topic:"Problems Are Opportunities!",activity:"Brainstorm solutions to real problems"},{wk:6,topic:"Inventing a Product",activity:"Design your own invention"},{wk:7,topic:"Inventing a Service",activity:"Create a Service Menu"},{wk:8,topic:"Pick Your Best Idea",activity:"Rate ideas and choose a winner"}]},
  { num:3, title:"Money Math & Smart Spending", color:KC.mustard, bg:KC.bgMustard, weeks:[{wk:9,topic:"Coins and Bills Bootcamp",activity:"Learn coin values and do money math"},{wk:10,topic:"Earning & Saving",activity:"Set up Spend, Save, Give jars"},{wk:11,topic:"What Things Cost",activity:"Price guessing game"},{wk:12,topic:"Profit = Income - Costs",activity:"Lemonade stand math"}]},
  { num:4, title:"Brand It! Marketing & Selling", color:KC.burntDk, bg:KC.bgOrange, weeks:[{wk:13,topic:"What Is a Brand?",activity:"Logo hunt and design your own"},{wk:14,topic:"Advertising 101",activity:"Make a poster ad and commercial"},{wk:15,topic:"Know Your Customer",activity:"Draw your ideal customer"},{wk:16,topic:"The Art of the Sale",activity:"Practice selling to family"}]},
  { num:5, title:"Build Your Mini Business", color:KC.oliveDk, bg:KC.bgOlive, weeks:[{wk:17,topic:"Business Plan on a Page",activity:"Fill out your business plan"},{wk:18,topic:"Supplies & Setup",activity:"Shopping list and startup costs"},{wk:19,topic:"Practice Run!",activity:"Soft launch with family"},{wk:20,topic:"Grand Opening Day",activity:"Open for real customers!"}]},
  { num:6, title:"Grow, Give & Celebrate", color:KC.mustardDk, bg:KC.bgMustard, weeks:[{wk:21,topic:"Count Your Profits",activity:"Business ledger and profit calculation"},{wk:22,topic:"Customer Feedback",activity:"Create and collect surveys"},{wk:23,topic:"Giving Back",activity:"Choose a cause and donate"},{wk:24,topic:"Graduation!",activity:"Reflect and get your certificate!"}]},
];

function AppHeader({ onNav, current }) {
  return (
    <header style={{ background: KC.oliveDk, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onNav("home")}>
          <TSMono size={28} color={KC.mustardLt} />
          <div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: KC.mustardLt }}>THE LITTLE VISIONARIES</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: KC.oliveLt }}>by The Visionary Architect</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["home","curriculum","progress"].map(k => (
            <button key={k} onClick={() => onNav(k)} style={{ background: current===k ? KC.burnt : "rgba(255,255,255,0.1)", color: KC.white, border: "none", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontFamily: "'Nunito', sans-serif", fontWeight: current===k?700:500, cursor: "pointer", textTransform: "capitalize" }}>{k}</button>
          ))}
          <a href="/" style={{ background: "rgba(255,255,255,0.1)", color: KC.mustardLt, borderRadius: 20, padding: "7px 16px", fontSize: 13, fontFamily: "'Nunito', sans-serif", textDecoration: "none" }}>Back to Site</a>
        </nav>
      </div>
    </header>
  );
}

function CurriculumPage({ completed, onToggle, onOpenAssignment }) {
  const [openUnit, setOpenUnit] = useState(null);
  return (
    <div style={{ maxWidth: 850, margin: "0 auto", padding: "36px 24px" }}>
      <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, color: KC.oliveDk, textAlign: "center", margin: "0 0 6px" }}>Curriculum</h2>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: KC.burnt, textAlign: "center", margin: "0 0 28px" }}>Tap a unit to explore. Click a week to open the full assignment!</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {UNITS.map(unit => {
          const isOpen = openUnit === unit.num;
          const doneCount = unit.weeks.filter(w => completed[`w${w.wk}`]).length;
          return (
            <div key={unit.num} style={{ borderRadius: 16, overflow: "hidden", border: `2px solid ${unit.color}` }}>
              <button onClick={() => setOpenUnit(isOpen ? null : unit.num)} style={{ width: "100%", border: "none", cursor: "pointer", background: unit.color, color: KC.white, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 600 }}>
                <span>Unit {unit.num}: {unit.title}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 12, padding: "3px 10px", fontSize: 13 }}>{doneCount}/4</span>
                  <span style={{ fontSize: 18, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "" }}>{"\u25BC"}</span>
                </span>
              </button>
              {isOpen && (
                <div style={{ background: unit.bg }}>
                  {unit.weeks.map(w => {
                    const done = completed[`w${w.wk}`];
                    return (
                      <div key={w.wk} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 20px", borderBottom: `1px solid ${unit.color}22`, cursor: "pointer" }}
                        onClick={() => onOpenAssignment(w.wk)}>
                        <button onClick={e => { e.stopPropagation(); onToggle(`w${w.wk}`); }} style={{
                          width: 28, height: 28, minWidth: 28, borderRadius: 8,
                          border: `2px solid ${unit.color}`, background: done ? unit.color : KC.white,
                          color: KC.white, fontSize: 16, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                        }}>{done ? "\u2713" : ""}</button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 600, color: KC.oliveDk }}> Week {w.wk}: {w.topic}</div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: KC.charcoal, marginTop: 3 }}>{w.activity}</div>
                        </div>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: unit.color, fontWeight: 700, marginTop: 4 }}>Open &rarr;</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressPage({ completed }) {
  const total = 24;
  const done = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px", textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, color: KC.oliveDk, margin: "0 0 24px" }}>My Progress</h2>
      <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="76" fill="none" stroke={KC.bgOlive} strokeWidth="14" />
          <circle cx="90" cy="90" r="76" fill="none" stroke={KC.olive} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${2*Math.PI*76}`} strokeDashoffset={`${2*Math.PI*76*(1-pct/100)}`} transform="rotate(-90 90 90)" style={{transition:"stroke-dashoffset 1s"}} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 36, fontWeight: 700, color: KC.oliveDk }}>{pct}%</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: KC.charcoal }}>{done} of {total} weeks</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
        {UNITS.map(u => {
          const d2 = u.weeks.filter(w => completed[`w${w.wk}`]).length;
          return (<div key={u.num}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontFamily:"'Fredoka',sans-serif",fontSize:14,fontWeight:600,color:KC.oliveDk}}>Unit {u.num}: {u.title}</span><span style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:KC.charcoal}}>{d2}/4</span></div><div style={{background:`${u.color}22`,borderRadius:8,height:14,overflow:"hidden"}}><div style={{height:"100%",background:u.color,borderRadius:8,width:`${(d2/4)*100}%`,transition:"width 0.8s"}}/></div></div>);
        })}
      </div>
      {pct===100&&<div style={{marginTop:32,background:KC.bgMustard,border:`3px solid ${KC.mustard}`,borderRadius:20,padding:28}}><div style={{fontSize:48}}>&#127891;</div><div style={{fontFamily:"'Fredoka',sans-serif",fontSize:22,color:KC.oliveDk,fontWeight:700}}>Congratulations, Little Visionary!</div></div>}
    </div>
  );
}

function HomePage({ onNav }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(32px, 6vw, 48px)", color: KC.oliveDk, margin: "0 0 8px" }}>The Little Visionaries</h1>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: KC.burnt, fontWeight: 600, margin: "0 0 32px" }}>Business School for Future Moguls</p>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: KC.charcoal, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>Welcome! Get ready to dream up big ideas, build a real mini business, learn to count your coins, and discover what it means to be a true entrepreneur!</p>
      <button onClick={() => onNav("curriculum")} style={{ background: KC.olive, color: KC.white, border: "none", borderRadius: 28, padding: "14px 32px", fontSize: 16, fontFamily: "'Fredoka', sans-serif", fontWeight: 600, cursor: "pointer" }}>Start Learning</button>
    </div>
  );
}

function LittleVisionariesApp() {
  const [page, setPage] = useState("home");
  const [completed, setCompleted] = useState({});
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [assignmentData, setAssignmentData] = useState({});
  const toggleWeek = key => setCompleted(p => ({ ...p, [key]: !p[key] }));

  if (activeAssignment) {
    return (
      <div style={{ background: KC.cream, minHeight: "100vh", fontFamily: "'Nunito', sans-serif" }}>
        <AppHeader onNav={k => { setActiveAssignment(null); setPage(k); }} current="curriculum" />
        <AssignmentView week={activeAssignment} onBack={() => setActiveAssignment(null)} data={assignmentData} setData={setAssignmentData} />
      </div>
    );
  }

  return (
    <div style={{ background: KC.cream, minHeight: "100vh", fontFamily: "'Nunito', sans-serif" }}>
      <AppHeader onNav={setPage} current={page} />
      {page === "home" && <HomePage onNav={setPage} />}
      {page === "curriculum" && <CurriculumPage completed={completed} onToggle={toggleWeek} onOpenAssignment={wk => setActiveAssignment(wk)} />}
      {page === "progress" && <ProgressPage completed={completed} />}
      <footer style={{ background: KC.oliveDk, padding: "16px 24px", textAlign: "center", marginTop: 40 }}>
        <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, color: KC.oliveLt }}>The Little Visionaries</span>
        <span style={{ color: KC.mustard, margin: "0 8px" }}>|</span>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: KC.mustardLt, fontStyle: "italic" }}>by The Visionary Architect</span>
      </footer>
    </div>
  );
}

// ── Access Gate ──
function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (code.trim().toUpperCase() === ACCESS_CODE) { onUnlock(); }
    else { setError(true); setTimeout(() => setError(false), 3000); }
  };
  return (
    <div style={{ minHeight: "100vh", background: C.creamLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: "40px 32px" }}>
        <TSMono size={48} color={C.olive} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.olive, margin: "20px 0 4px" }}>The Little Visionaries</h1>
        <p style={{ fontSize: 13, color: C.brown, marginBottom: 24 }}>Enter your access code to unlock the curriculum.</p>
        <input type="text" value={code} onChange={e => { setCode(e.target.value); setError(false); }} onKeyDown={e => e.key==="Enter"&&handleSubmit()} placeholder="Enter access code" style={{ width: "100%", padding: "16px", border: `2px solid ${error?"#C0392B":C.olive}44`, fontSize: 16, textAlign: "center", letterSpacing: 3, textTransform: "uppercase", boxSizing: "border-box", borderRadius: 0 }} />
        {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 8, fontWeight: 600 }}>Invalid code. Check your email.</p>}
        <button onClick={handleSubmit} style={{ width: "100%", marginTop: 16, padding: 16, background: C.olive, color: C.white, border: "none", fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}>Unlock Curriculum</button>
        <p style={{ fontSize: 12, color: C.grayLt, marginTop: 20 }}>Don't have a code? <a href="/" style={{ color: C.brown, fontWeight: 700 }}>Subscribe here</a></p>
      </div>
    </div>
  );
}

export default function ProtectedApp() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@0,300;0,400;0,600;0,700&family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0}body{overflow-x:hidden}input:focus,textarea:focus{outline:2px solid #C4952E;outline-offset:1px}::placeholder{color:#B8B1A5}`}</style>
      {unlocked ? <LittleVisionariesApp /> : <AccessGate onUnlock={() => setUnlocked(true)} />}
    </>
  );
}
