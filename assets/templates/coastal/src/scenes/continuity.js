// Continuity repairs for the original wish sequence; no added flashback story.
function breezeState(t){
  const lt=t-65.44,u=17,walk=stroll(lt,0,6.8,700,1100,u),mood=emotions(lt,[[0,'hopeful',{lookX:.6,lookY:-.2}],[2.5,'starstruck',{lookX:.8,lookY:-.4}],[5,'love',{lookX:.9,lookY:-.3}]],{take:.65});
  const pose={...mood,view:'q',flip:false,walk:walk.walk,dy:(mood.dy||0)*.3+walk.dy,aL:.5,aR:-.3};
  return {x:walk.x,y:GROUND,u,pose};
}
function bagOpening(state){
  const o=state.pose,u=state.u,sq=(o.sq||0)+(o.take||0),rot=o.rot||0,sx=(o.flip?-1:1)*(o.sx??1)*(1+sq*.6),sy=(o.sy??1)*(1-sq),x=(o.view==='side'?-3.8:-5.7)*u*sx,y=-7.25*u*sy;
  return [state.x+(o.dx||0)*u+x*Math.cos(rot)-y*Math.sin(rot),state.y+(o.dy||0)*u+x*Math.sin(rot)+y*Math.cos(rot)];
}
function wishFlightState(t){
  const start=68.24,join=72.32,end=74.52;
  if(t<start||t>=end)return {visible:false,landed:t>=end};
  if(t<join){const p=easeOut(seg(t,start,join)),xy=arcPt(bagOpening(breezeState(start)),[1400,200],140,p);return {visible:true,x:xy[0],y:xy[1],s:lerp(4,22,ease(seg(t,start,start+.4)))*(1-.09*ease(seg(t,join-.5,join))),angle:lerp(-.4,.4,p),glow:p,land:0};}
  const land=easeIn(seg(t,join,end));return {visible:true,x:lerp(1400,980,land),y:lerp(200,GROUND-10,land),s:20,angle:lerp(.4,1.2,land),glow:1-land*.5,land};
}
