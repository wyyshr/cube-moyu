import * as THREE from "three";
const vs = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    }
`;
const loading = document.querySelector(".loading")
const defines = { MODE: 0 };
const selects = [ "手绘", "体素", "卡通" ]
const size = Math.min(window.innerWidth, window.innerHeight)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(size, size)
document.querySelector(".canvas").appendChild(renderer.domElement)

const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager)
const noiseTex = loader.load("./assets/noise.png")
noiseTex.wrapS = THREE.RepeatWrapping
noiseTex.wrapT = THREE.RepeatWrapping

const tex = loader.load("./assets/GGBond.jpg", () => {
    loading.style.display = 'none'
})
const g = new THREE.PlaneGeometry(2, 2)
const m = new THREE.ShaderMaterial({
    uniforms: {
        iChannel0: { value: tex },
        iChannel1: { value: noiseTex },
        iResolution: { value: new THREE.Vector2(size, size) },
        _ChannelResolution: { value: new THREE.Vector4() },
        _Time: { value: 0 },
        iFrame: { value: 0 },
    },
    defines: defines,
    vertexShader: vs,
    fragmentShader: `
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform vec2 iResolution;
    uniform vec4 _ChannelResolution;
    uniform float _Time;
    uniform int iFrame;
    varying vec2 vUv;

    #if MODE == 0
        #define Res0 _ChannelResolution.xy
        #define Res1 _ChannelResolution.zw
        #define Res  iResolution.xy
        
        vec4 getRand(vec2 pos)
        {
            return textureLod(iChannel1, pos/Res1/iResolution.y*1080., 0.0);
        }

        vec4 getCol(vec2 pos)
        {
            // take aspect ratio into account
            vec2 uv=((pos-Res.xy*.5)/Res.y*Res0.y)/Res0.xy+.5;
            vec4 c1=texture(iChannel0,uv);
            vec4 e=smoothstep(vec4(-0.05),vec4(-0.0),vec4(uv,vec2(1)-uv));
            c1=mix(vec4(1,1,1,0),c1,e.x*e.y*e.z*e.w);
            float d=clamp(dot(c1.xyz,vec3(-.5,1.,-.5)),0.0,1.0);
            vec4 c2=vec4(.7);
            return min(mix(c1,c2,1.8*d),.7);
        }

        vec4 getColHT(vec2 pos)
        {
            return smoothstep(.95,1.05,getCol(pos)*.8+.2+getRand(pos*.7));
        }

        float getVal(vec2 pos)
        {
            vec4 c=getCol(pos);
            return pow(dot(c.xyz,vec3(.333)),1.)*1.;
        }

        vec2 getGrad(vec2 pos, float eps)
        {
            vec2 d=vec2(eps,0);
            return vec2(
                getVal(pos+d.xy)-getVal(pos-d.xy),
                getVal(pos+d.yx)-getVal(pos-d.yx)
            )/eps/2.;
        }

        #define AngleNum 3

        #define SampNum 16
        #define PI2 6.28318530717959

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {

            // vec2 pos = fragCoord+4.0* sin(_Time*1.*vec2(1,1.7)) *iResolution.y/400.;
            vec2 pos = fragCoord+4.0* clamp(_Time*vec2(1,1.7), 0., 1.) *iResolution.y/400.;
            vec3 col = vec3(0);
            vec3 col2 = vec3(0);
            float sum=0.;
            for(int i=0;i<AngleNum;i++)
            {
                float ang=PI2/float(AngleNum)*(float(i)+.8);
                vec2 v=vec2(cos(ang),sin(ang));
                for(int j=0;j<SampNum;j++)
                {
                    vec2 dpos  = v.yx*vec2(1,-1)*float(j)*iResolution.y/400.;
                    vec2 dpos2 = v.xy*float(j*j)/float(SampNum)*.5*iResolution.y/400.;
                    vec2 g;
                    float fact;
                    float fact2;

                    for(float s=-1.;s<=1.;s+=2.)
                    {
                        vec2 pos2=pos+s*dpos+dpos2;
                        vec2 pos3=pos+(s*dpos+dpos2).yx*vec2(1,-1)*2.;
                        g=getGrad(pos2,.4);
                        fact=dot(g,v)-.5*abs(dot(g,v.yx*vec2(1,-1)))/**(1.-getVal(pos2))*/;
                        fact2=dot(normalize(g+vec2(.0001)),v.yx*vec2(1,-1));
                        
                        fact=clamp(fact,0.,.05);
                        fact2=abs(fact2);
                        
                        fact*=1.-float(j)/float(SampNum);
                        col += fact;
                        col2 += fact2*getColHT(pos3).xyz;
                        sum+=fact2;
                    }
                }
            }
            col/=float(SampNum*AngleNum)*.75/sqrt(iResolution.y);
            col2/=sum;
            col.x*=(.6+.8*getRand(pos*.7).x);
            col.x=1.-col.x;
            col.x*=col.x*col.x;

            vec2 s=sin(pos.xy*.1/sqrt(iResolution.y/400.));
            float r=length(pos-iResolution.xy*.5)/iResolution.x;
            float vign=1.-r*r*r;
            fragColor = vec4(vec3(col.x*col2*vign),1);
            //fragColor=getCol(fragCoord);
        }
    #elif MODE == 1
        #define SUBDIVIDE
        #define SPARKLES
        #define GRAYSCALE
        #define FAR 20.

        float objID;

        vec2 uvmapping(vec2 uv1, vec2 fragCoord) {
            vec2 uv = uv1;
            vec2 imgSize = _ChannelResolution.xy;
            vec2 viewPort = iResolution.xy;

            float imgRatio = imgSize.x / imgSize.y;
            float screenRatio = viewPort.x / viewPort.y;

            vec2 resizeTarget = viewPort;

            vec2 startPos = vec2(0.0);
            if(imgRatio > screenRatio) {
                resizeTarget.x = viewPort.x;
                resizeTarget.y = resizeTarget.x / imgRatio;
                startPos.y = (viewPort.y - resizeTarget.y) / 2.0;
            } else {
                resizeTarget.y = viewPort.y;
                resizeTarget.x = resizeTarget.y * imgRatio;
                startPos.x = (viewPort.x - resizeTarget.x) / 2.0;
            }

            //窗口中与图像宽高比保持一致的区域内渲染图像
            if(fragCoord.x >= startPos.x && fragCoord.x <= startPos.x + resizeTarget.x && fragCoord.y >= startPos.y && fragCoord.y <= startPos.y + resizeTarget.y) {
                uv.x = (fragCoord.x - startPos.x) / resizeTarget.x;
                uv.y = (fragCoord.y - startPos.y) / resizeTarget.y;
            } else {
                uv = vec2(-1.,-1.);
            }
            return uv;
        }

        mat2 rot2(in float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

        float hash21(vec2 p){  return fract(sin(dot(p, vec2(27.609, 57.583)))*43758.5453); }

        vec3 getTex(vec2 p){
            p *= vec2(iResolution.y/iResolution.x, 1);
            vec3 tx = texture(iChannel0, fract(p/2. - .5)).xyz;
            return tx*tx; // Rough sRGB to linear conversion.
        }

        float hm(in vec2 p){ return dot(getTex(p), vec3(.299, .587, .114)); }

        float opExtrusion(in float sdf, in float pz, in float h){
            vec2 w = vec2( sdf, abs(pz) - h );
            return min(max(w.x, w.y), 0.) + length(max(w, 0.));
        }

        float sBoxS(in vec2 p, in vec2 b, in float sf){

        return length(max(abs(p) - b + sf, 0.)) - sf;
        }
        
        vec4 blocks(vec3 q3){
            const float scale = 1./16.;

            const vec2 l = vec2(scale);
            const vec2 s = l*2.;
            
            float d = 1e5;
            vec2 p, ip;
            
            vec2 id = vec2(0);
            vec2 cntr = vec2(0);
            
            vec2[4] ps4 = vec2[4](vec2(-l.x, l.y), l, -l, vec2(l.x, -l.y));
            
            float boxID = 0.; // Box ID. Not used in this example, but helpful.
            
            for(int i = 0; i<4; i++){

                cntr = ps4[i]/2.;
                p = q3.xy - cntr;
                ip = floor(p/s) + .5; // Local tile ID.
                p -= (ip)*s; // New local position.

            
                vec2 idi = ip*s + cntr;
                float h = hm(idi);
                #ifndef SUBDIVIDE
                h = floor(h*15.999)/15.*.15; // Or just, "h *= .15," for nondiscreet heights.
                #endif
                
                #ifdef SUBDIVIDE
                vec4 h4;
                int sub = 0;
                for(int j = 0; j<4; j++){
                    h4[j] = hm(idi + ps4[j]/4.);
                    if(abs(h4[j] - h)>1./15.) sub = 1;
                }
                
                h = floor(h*15.999)/15.*.15;
                h4 = floor(h4*15.999)/15.*.15;
                
                if(sub==1){
                    vec4 d4, di4;

                    for(int j = 0; j<4; j++){
                        d4[j] = sBoxS(p - ps4[j]/4., l/4. - .05*scale, .005);
                        di4[j] = opExtrusion(d4[j], (q3.z + h4[j]), h4[j]);
                        
                        if(di4[j]<d){
                            d = di4[j];
                            id = idi + ps4[j]/4.;
                        }
                    }
                }
                else {
                #endif
                    float di2D = sBoxS(p, l/2. - .05*scale, .015);
                    float di = opExtrusion(di2D, (q3.z + h), h);
                    
                    if(di<d){
                        d = di;
                        id = idi;
                    }
                    
                #ifdef SUBDIVIDE    
                }
                #endif
                
            }
            
            return vec4(d, id, boxID);
        }


        vec2 gID;

        float map(vec3 p){
            
            float fl = -p.z + .1;

            vec4 d4 = blocks(p);
            gID = d4.yz; // Individual block ID.
            
        
            objID = fl<d4.x? 1. : 0.;
            
            return  min(fl, d4.x);
        
        }

        
        float trace(in vec3 ro, in vec3 rd){

            float t = 0., d;
            
            for(int i = min(iFrame, 0); i<64; i++){
            
                d = map(ro + rd*t);
                if(abs(d)<.001 || t>FAR) break; // Alternative: 0.001*max(t*.25, 1.), etc.
                
                t += d*.7; 
            }

            return min(t, FAR);
        }


        // Standard normal function. It's not as fast as the tetrahedral calculation, but more symmetrical.
        vec3 getNormal(in vec3 p, float t) {
            const vec2 e = vec2(.001, 0);
            return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy),	map(p + e.yyx) - map(p - e.yyx)));
        }


        // Cheap shadows are hard. In fact, I'd almost say, shadowing particular scenes with limited 
        // iterations is impossible... However, I'd be very grateful if someone could prove me wrong. :)
        float softShadow(vec3 ro, vec3 lp, vec3 n, float k){

            // More would be nicer. More is always nicer, but not really affordable... Not on my slow test machine, anyway.
            const int maxIterationsShad = 24; 
            
            ro += n*.0015;
            vec3 rd = lp - ro; // Unnormalized direction ray.
            

            float shade = 1.;
            float t = 0.;//.0015; // Coincides with the hit condition in the "trace" function.  
            float end = max(length(rd), 0.0001);
            //float stepDist = end/float(maxIterationsShad);
            rd /= end;

            // Max shadow iterations - More iterations make nicer shadows, but slow things down. Obviously, the lowest 
            // number to give a decent shadow is the best one to choose. 
            for (int i = min(iFrame, 0); i<maxIterationsShad; i++){

                float d = map(ro + rd*t);
                shade = min(shade, k*d/t);
                //shade = min(shade, smoothstep(0., 1., k*h/dist)); // Subtle difference. Thanks to IQ for this tidbit.
                // So many options here, and none are perfect: dist += min(h, .2), dist += clamp(h, .01, stepDist), etc.
                t += clamp(d, .01, .25); 
                
                
                // Early exits from accumulative distance function calls tend to be a good thing.
                if (d<0. || t>end) break; 
            }

            // Sometimes, I'll add a constant to the final shade value, which lightens the shadow a bit --
            // It's a preference thing. Really dark shadows look too brutal to me. Sometimes, I'll add 
            // AO also just for kicks. :)
            return max(shade, 0.); 
        }


        // I keep a collection of occlusion routines... OK, that sounded really nerdy. :)
        // Anyway, I like this one. I'm assuming it's based on IQ's original.
        float calcAO(in vec3 p, in vec3 n)
        {
            float sca = 3., occ = 0.;
            for( int i = 0; i<5; i++ ){
            
                float hr = float(i + 1)*.15/5.;        
                float d = map(p + n*hr);
                occ += (hr - d)*sca;
                sca *= .7;
            }
            
            return clamp(1. - occ, 0., 1.);  
            
            
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord ){
            // Screen coordinates.
            vec2 uv = fragCoord/iResolution.xy;
            uv = uvmapping(uv, vUv*iResolution);
            uv -= 0.5;
            if(uv.x < -0.5 || uv.x > 0.5 || uv.y < -0.5 || uv.y > 0.5) {
                fragColor = vec4(0.);
                return;
            }
            
            // Camera Setup.
            vec3 lk = vec3(0, 0, 0);//vec3(0, -.25, _Time);  // "Look At" position.
            vec3 ro = lk + vec3(-.5*.3*cos(_Time/2.), -.5*.2*sin(_Time/2.), -2); // Camera position, doubling as the ray origin.
        
            // Light positioning. One is just in front of the camera, and the other is in front of that.
            vec3 lp = ro + vec3(1.5, 2, -1);// Put it a bit in front of the camera.
            

            // Using the above to produce the unit ray-direction vector.
            float FOV = 1.; // FOV - Field of view.
            vec3 fwd = normalize(lk-ro);
            vec3 rgt = normalize(vec3(fwd.z, 0., -fwd.x )); 
            // "right" and "forward" are perpendicular, due to the dot product being zero. Therefore, I'm 
            // assuming no normalization is necessary? The only reason I ask is that lots of people do 
            // normalize, so perhaps I'm overlooking something?
            vec3 up = cross(fwd, rgt); 

            // rd - Ray direction.
            vec3 rd = normalize(fwd + FOV*uv.x*rgt + FOV*uv.y*up);
            
            // Swiveling the camera about the XY-plane.
            //rd.xy *= rot2( sin(_Time)/32. );

            
        /*      
            // Mouse controls.   
            vec2 ms = vec2(0);
            if (iMouse.z > 1.0) ms = (iMouse.xy - iResolution.xy*.5)/iResolution.xy;
            vec2 a = sin(vec2(1.5707963, 0) - ms.x); 
            mat2 rM = mat2(a, -a.y, a.x);
            rd.xz = rd.xz*rM; 
            a = sin(vec2(1.5707963, 0) - ms.y); 
            rM = mat2(a, -a.y, a.x);
            rd.yz = rd.yz*rM;
        */    
            
            
            // Raymarch to the scene.
            float t = trace(ro, rd);
            
            // Save the block ID and object ID.
            vec2 svGID = gID;
            
            float svObjID = objID;
        
            
            // Initiate the scene color to black.
            vec3 col = vec3(0);
            
            // The ray has effectively hit the surface, so light it up.
            if(t < FAR){
                
            
                // Surface position and surface normal.
                vec3 sp = ro + rd*t;
                //vec3 sn = getNormal(sp, edge, crv, ef, t);
                vec3 sn = getNormal(sp, t);
                
                
                // Obtaining the texel color. 
                vec3 texCol;   

                // The extruded grid.
                if(svObjID<.5){
                    
                    // Coloring the individual blocks with the saved ID.
                    vec3 tx = getTex(svGID);
                    //vec3 tx = getTex(sp.xy - .5/16.); // See scale in the distance function.
                    // Greyscale value, just in case people switch to the Britney video, etc.
                    // Stylistically, the example works better with color. The Britney video
                    // looks OK, but I'm more of a Shirley Jones kind of guy. :)
                    #ifdef GRAYSCALE
                    texCol = vec3(1)*dot(tx, vec3(.299, .587, .114));
                    #else 
                    texCol = tx;
                    #endif
                    
                    
                    #ifdef SPARKLES
                    
                    // Putting some blinking colored dots in the background. I did this to liven
                    // things up a bit. It's a little quirky, but looks... interesting, I guess. :D
                    float rnd = fract(sin(dot((svGID), vec2(141.13, 289.97)))*43758.5453);
                    float rnd2 = fract(sin(dot((svGID + .037), vec2(141.13, 289.97)))*43758.5453);
                    rnd = smoothstep(.9, .95, cos(rnd*6.283 + _Time*2.)*.5 + .5);
                    vec3 rndCol = (.5 + .45*cos(6.2831*mix(0., .3, rnd2) + vec3(0, 1, 2)/1.1));
                    rndCol = mix(rndCol, rndCol.xzy, uv.y*.75 + .5);
                    rndCol = mix(vec3(1), rndCol*50., rnd*smoothstep(1. - (1./1./15. + .001), 1., 1. - texCol.x));
                    
                    texCol *= rndCol;
                    
                    #endif
                    
                    // Ramping the shade up a bit.
                    texCol = smoothstep(0., 1., texCol);
        
                }
                else {
                    
                    // The dark floor in the background. Hiddent behind the pylons, but
                    // you still need it.
                    texCol = vec3(0);
                }
            
                
                // Light direction vector.
                vec3 ld = lp - sp;

                // Distance from respective light to the surface point.
                float lDist = max(length(ld), .001);
                
                // Normalize the light direction vector.
                ld /= lDist;

                
                
                // Shadows and ambient self shadowing.
                float sh = softShadow(sp, lp, sn, 8.);
                float ao = calcAO(sp, sn); // Ambient occlusion.
                sh = min(sh + ao*.25, 1.);
                
                // Light attenuation, based on the distances above.
                float atten = 1./(1. + lDist*.05);

                
                // Diffuse lighting.
                float diff = max( dot(sn, ld), 0.);
                //diff = pow(diff, 4.)*2.; // Ramping up the diffuse.
                
                // Specular lighting.
                float spec = pow(max(dot(reflect(ld, sn), rd ), 0.), 16.); 
                
                // Fresnel term. Good for giving a surface a bit of a reflective glow.
                float fre = pow(clamp(dot(sn, rd) + 1., 0., 1.), 2.);
                
                
                // Combining the above terms to procude the final color.
                col = texCol*(diff + ao*.3 + vec3(.25, .5, 1)*diff*fre*16. + vec3(1, .5, .2)*spec*2.);

                // Shading.
                col *= ao*sh*atten;
                
            }
            fragColor = vec4(sqrt(max(col, 0.)), 1);
        } 
    #elif MODE == 2
        vec2 uvmapping(vec2 uv1, vec2 fragCoord) {
            vec2 uv = uv1;
            vec2 imgSize = _ChannelResolution.xy;
            vec2 viewPort = iResolution.xy;

            float imgRatio = imgSize.x / imgSize.y;
            float screenRatio = viewPort.x / viewPort.y;

            vec2 resizeTarget = viewPort;

            vec2 startPos = vec2(0.0);
            if(imgRatio > screenRatio) {
                resizeTarget.x = viewPort.x;
                resizeTarget.y = resizeTarget.x / imgRatio;
                startPos.y = (viewPort.y - resizeTarget.y) / 2.0;
            } else {
                resizeTarget.y = viewPort.y;
                resizeTarget.x = resizeTarget.y * imgRatio;
                startPos.x = (viewPort.x - resizeTarget.x) / 2.0;
            }

            //窗口中与图像宽高比保持一致的区域内渲染图像
            if(fragCoord.x >= startPos.x && fragCoord.x <= startPos.x + resizeTarget.x && fragCoord.y >= startPos.y && fragCoord.y <= startPos.y + resizeTarget.y) {
                uv.x = (fragCoord.x - startPos.x) / resizeTarget.x;
                uv.y = (fragCoord.y - startPos.y) / resizeTarget.y;
            } else {
                uv = vec2(-1.,-1.);
            }
            return uv;
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
        {
            #define EPS 2.e-3
            vec2 uv = fragCoord.xy / iResolution.xy;
            uv = uvmapping(uv, fragCoord);
            if(uv.x < -0. || uv.x > 1. || uv.y < -0. || uv.y > 1.) {
                fragColor = vec4(0.);
                return;
            }
            // uv.y *= _ChannelResolution.y/_ChannelResolution.x;
            // vec2 uv=((fragCoord-_ChannelResolution.xy*.5)/_ChannelResolution.y*_ChannelResolution.y)/_ChannelResolution.xy+.5;

            vec2 uvx = uv+vec2(EPS,0.);
            vec2 uvy = uv+vec2(0.,EPS);
            
            vec2 ref = vec2(.5,.5);
            vec3 col0 = texture(iChannel0, ref).xyz;
            float lum0 = (col0.x+col0.y+col0.z)/3.;
            
            bool isin = false;
            
            vec3 tex,texx,texy;
            vec2 grad; float g=1.;
            
            for (int i=0; i<30; i++) 
            {
                tex = texture(iChannel0, uv).xyz;

                if (isin)
                {
                    uvx = uv+vec2(EPS,0.);
                    uvy = uv+vec2(0.,EPS);	
                }
                texx = texture(iChannel0, uvx).xyz;
                texy = texture(iChannel0, uvy).xyz;
                grad  = vec2(texx.x-tex.x,texy.x-tex.x); 
        //		if (i==0) g = dot(grad,grad);
                
                uv    += EPS*grad;
                uvx.x += EPS*grad.x;
                uvy.y += EPS*grad.y;
            }
            
            vec3 col = texture(iChannel0, uv).xyz;
            vec3 m = vec3(.2,.1,.1);
            float lum = (col.x+col.y+col.z)/3.;
        #if 1
            g = 4.*dot(grad,grad);
            g = pow(max(0.,1.-g),30.);
            g = clamp(g,0.,1.);
        #endif
            col = g * col / pow(lum,.55);
            
            fragColor = vec4(col, 1.0);
        }
    
    #endif

    void main() {
        mainImage(gl_FragColor, vUv * iResolution);
    }
    `
})

const plane = new THREE.Mesh(g, m)
scene.add(plane)

manager.onLoad = () => {
    plane.material.uniforms._ChannelResolution.value.set(tex.image.width, tex.image.height, noiseTex.image.width, noiseTex.image.height)
}

let video, frame = 0

function loop(time) {
    requestAnimationFrame(loop)
    plane.material.uniforms._Time.value = time / 1000
    plane.material.uniforms.iFrame.value = frame
    renderer.render(scene, camera)
    if (video && !video.src) {
        video.paused && video.play()
    }
    frame++
}
loop()

// upload
const imgDiv = document.querySelector(".image")
document.querySelector(".upload").addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file.type.includes("image") && !file.type.includes("video")) {
        alert("请上传图片或视频")
        return
    }
    loading.style.display = 'block'
    const reader = new FileReader();
    reader.onload = function (e) {
        if (video) video.src = ""
        plane.material.uniforms.iChannel0.value.dispose()
        if (file.type.includes("image")) {
            const img = new Image()
            img.onload = function () {
                const texture = new THREE.Texture(img);
                texture.needsUpdate = true;
                plane.material.uniforms.iChannel0.value = texture
                plane.material.uniforms._ChannelResolution.value.x = img.width
                plane.material.uniforms._ChannelResolution.value.y = img.height
            }
            img.src = e.target.result
            imgDiv.src = e.target.result
            loading.style.display = 'none'
        }
        if (file.type.includes("video")) {
            video = document.createElement("video")
            window.video = video
            video.loop = true
            video.muted = true
            video.oncanplay = () => {
                video.play()
                const texture = new THREE.VideoTexture(video)
                texture.needsUpdate = true;
                plane.material.uniforms.iChannel0.value = texture
                plane.material.uniforms._ChannelResolution.value.x = video.videoWidth
                plane.material.uniforms._ChannelResolution.value.y = video.videoHeight
                loading.style.display = 'none'
            }
            video.src = e.target.result
            imgDiv.src = "./assets/video_preview.png"
        }
    };
    reader.readAsDataURL(file);
});
// end upload

const select = document.querySelector("#select")
for (let i = 0; i < selects.length; i++) {
    const option = document.createElement("option")
    option.value = i
    option.innerHTML = selects[i]
    select.append(option)
}
select.onchange = () => {
    defines.MODE = Number(select.value)
    plane.material.needsUpdate = true
}

renderer.domElement.addEventListener("touchstart", () => {
    timeout = setTimeout(() => {
        
    }, 1000)
})
renderer.domElement.addEventListener("touchend", () => {
    clearTimeout(timeout)
})