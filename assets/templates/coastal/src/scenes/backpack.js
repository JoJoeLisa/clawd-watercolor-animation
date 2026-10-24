// The redesigned blue backpack uses the original pigment colours, inside the character's pose transform.
function packBody(u,sw,view){
  const isBack=view==='back'||view==='qback',cx=isBack?(view==='qback'?-.7*u:0):(view==='side'?-3.8:-4.45)*u,w=isBack?4.8*u:3.5*u;
  const x=cx-w/2,y=-7.25*u,h=4.65*u;
  boilSeed('fitted-pack');
  paint(rrPts(x,y,w,h,.58*u,.03*u),{wash:'#5B7FA8',fill:mixCol('#5B7FA8',PAL.ink,.22),fillOp:68,bleed:.05,tex:.55,ink:PAL.ink,sw:sw*.64});
  paint(rrPts(x+.10*w,y+.08*h,w*.8,h*.25,.35*u,.02*u),{wash:'#3E5F86',fill:'#5B7FA8',fillOp:40,tex:.45,ink:PAL.ink,sw:sw*.42});
  paint(rrPts(x+.13*w,y+.57*h,w*.74,h*.28,.28*u,.02*u),{wash:mixCol('#5B7FA8',PAL.cream,.12),fill:'#3E5F86',fillOp:45,tex:.55,ink:PAL.ink,sw:sw*.40});
  inkLine([[cx-.6*u,y+.05*u],[cx-.45*u,y-.58*u],[cx+.45*u,y-.58*u],[cx+.6*u,y+.05*u]],sw*.7,'#3E5F86','ink',.6);
  inkLine([[x+.22*w,y+.65*h],[x+.78*w,y+.65*h]],sw*.38,mixCol('#3E5F86',PAL.ink,.15),'inkfine',.1);
  paint(rrPts(cx-.16*u,y+.25*h,.32*u,.38*u,.08*u),{wash:mixCol(PAL.cream,'#5B7FA8',.32),ink:null});
}
function clawdPack(x,y,u,o={}){
  if(o.view==='side'&&!o.quickPass)o={...o,view:'q'};
  const view=o.view||'q',wear=!o.noPack,behind=wear&&!['back','qback'].includes(view),onBack=wear&&(view==='back'||view==='qback');
  clawd(x,y,u,{...o,view,
    drawBehind:behind?(uu,sw)=>{packBody(uu,sw,view);if(o.drawBehind)o.drawBehind(uu,sw);}:o.drawBehind,
    draw:(uu,sw)=>{if(onBack)packBody(uu,sw,view);if(o.draw)o.draw(uu,sw);}
  });
}
