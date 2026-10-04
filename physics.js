'use strict';
window.ElectraPhysics = {
  defaults(id) {
    return [{closed:false},{added:false},{v:12,r:4},{parts:[false,false,false,false],closed:false},{v:12,r1:2,r2:4,r3:8,r4:6,closed:true}][id-1];
  },
  calculate(id,s) {
    if(id===1) return {upper:s.closed?6/20:0,middle:6/10,total:(s.closed?6/20:0)+6/10};
    if(id===2) return {i1:.5,i2:s.added?.5:0,total:s.added?1:.5,p1:3,req:s.added?6:12};
    if(id===3) return {current:s.v/s.r,power:s.v*s.v/s.r};
    if(id===4) {
      const branches=Number(s.parts[2])+Number(s.parts[3]);
      const active=s.parts[0]&&s.parts[1]&&s.closed&&branches>0;
      const rp=branches?12/branches:Infinity;
      const total=active?12/(2+rp):0;
      const vp=active?12-total*2:0;
      return {active,total,vp,upper:active&&s.parts[2]?vp/12:0,lower:active&&s.parts[3]?vp/12:0,complete:s.parts.every(Boolean)};
    }
    if(id===5) {
      const upperR=s.r2+s.r3;
      const rp=1/(1/upperR+1/s.r4);
      const totalR=s.r1+rp;
      const total=s.closed?s.v/totalR:0;
      const vp=total*rp;
      return {upperR,rp,totalR,total,vr1:total*s.r1,vp,upper:vp/upperR,lower:vp/s.r4};
    }
    throw new Error('Misi tidak dikenal.');
  }
};
