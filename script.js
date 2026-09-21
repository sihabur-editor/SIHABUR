document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 1000); }, 2100);

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  if (window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", e => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
      cursorOutline.animate({left:e.clientX+"px",top:e.clientY+"px"}, {duration:450,fill:"forwards"});
    });
    document.querySelectorAll("a,.tilt-card,.magnetic").forEach(el => {
      el.addEventListener("mouseenter",()=>cursorOutline.classList.add("hover"));
      el.addEventListener("mouseleave",()=>cursorOutline.classList.remove("hover"));
    });
  }

  // Lightweight star particles.
  const canvas = document.getElementById("particle-canvas"), ctx = canvas.getContext("2d");
  let w=0,h=0,stars=[];
  const resize=()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;};
  const seed=()=>{stars=Array.from({length:innerWidth<700?55:110},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.2,s:Math.random()*.25+.05,a:Math.random()*.6+.1}));};
  const draw=()=>{ctx.clearRect(0,0,w,h);for(const p of stars){p.y-=p.s;if(p.y<0)p.y=h;ctx.fillStyle=`rgba(170,220,255,${p.a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)};
  addEventListener("resize",()=>{resize();seed()}); resize(); seed(); draw();

  // GSAP scroll-driven parallax, inspired by the supplied multi-scene reference.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const layers = gsap.utils.toArray("[data-depth]");
    layers.forEach(el => {
      const depth = Number(el.dataset.depth || .1);
      gsap.to(el, {
        yPercent: -depth * 85,
        scale: 1 + depth * .16,
        ease: "none",
        scrollTrigger: {trigger:"#hero",start:"top top",end:"bottom top",scrub:2}
      });
    });

    gsap.to(".hero-copy",{yPercent:-22,opacity:.12,ease:"none",
      scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:2}});
    gsap.to(".portrait-wrap",{yPercent:-42,scale:.9,ease:"none",
      scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:2}});
    gsap.to(".scene-gradient",{rotation:3,ease:"none",
      scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:3}});

    gsap.utils.toArray(".reveal").forEach(el=>{
      ScrollTrigger.create({trigger:el,start:"top 84%",onEnter:()=>el.classList.add("active"),once:true});
    });
  } else {
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("active"));
  }

  // Mouse depth on desktop.
  if (window.matchMedia("(pointer:fine)").matches) {
    const stage = document.querySelector(".parallax-stage");
    window.addEventListener("mousemove", e=>{
      const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
      stage.querySelectorAll("[data-depth]").forEach(el=>{
        const d=Number(el.dataset.depth||.1);
        el.style.marginLeft=`${x*d*28}px`;
        el.style.marginTop=`${y*d*18}px`;
      });
    });
  }

  document.querySelectorAll(".magnetic").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{
      const r=btn.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${x*.18}px,${y*.18}px)`;
    });
    btn.addEventListener("mouseleave",()=>btn.style.transform="");
  });

  document.querySelectorAll(".tilt-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*5}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave",()=>card.style.transform="");
  });

  const counters = document.querySelectorAll(".counter");
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target,target=Number(el.dataset.target),start=performance.now();
      const tick=now=>{
        const p=Math.min((now-start)/1400,1),v=Math.floor((1-Math.pow(1-p,3))*target);
        el.textContent=v+(p===1?"+":"");
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); io.unobserve(el);
    });
  },{threshold:.5});
  counters.forEach(c=>io.observe(c));
});