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
const selects = [ "手绘", "卡通", "铅笔" ]
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
    vec3 rgb2hsv(vec3 c){
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
        vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
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


    ///outlines
    mat3 sobelX = mat3(-1.0, -2.0, -1.0,
                        0.0,  0.0,  0.0,
                        1.0,  2.0,  1.0);
    mat3 sobelY = mat3(-1.0,  0.0,  1.0,
                    -2.0,  0.0,  2.0,
                    -1.0,  0.0,  1.0);

    float lum(vec3 rgb){
        return (0.2126*rgb.r + 0.7152*rgb.g + 0.0722*rgb.b);
    }

    vec3 stepColor(vec3 col){
        vec3 hsv = rgb2hsv(col);
        hsv.z = hsv.z <= 0.20 ? hsv.z = 0.1 :
                //hsv.z <= 0.33 ? hsv.z = 0.25 :
                hsv.z <= 0.67 ? hsv.z = 0.72 :    		
                hsv.z <= 0.80 ? hsv.z = 0.85 :  		
                //hsv.z <= 0.90 ? hsv.z = 0.92 :
                                hsv.z = 0.9;
        //float stp = 0.25;
        //hsv.z =  clamp(floor(hsv.z/stp) * stp  ,0.0,1.0);
        return hsv2rgb(hsv);
    }


    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord.xy / iResolution.xy;
        uv = uvmapping(uv, fragCoord);
        if(uv.x < -0. || uv.x > 1. || uv.y < -0. || uv.y > 1.) {
            fragColor = vec4(0.);
            return;
        }
        //--- outline
        vec3 sx = vec3(0);
        vec3 sy = vec3(0);  
        for(int i=0; i<=2; i++){
            for(int j=0; j<=2; j++){
                vec2 p = vec2(int(fragCoord.x)+i-1, int(fragCoord.y)+j-1);
                vec3 rgb = texture(iChannel0, uvmapping(p/iResolution.xy, p)).xyz;
                sx += rgb * sobelX[i][j];
                sy += rgb * sobelY[i][j];
            }
        }
        float finalLum = pow(lum(sx*sx + sy*sy), 0.5);
        finalLum = finalLum < 0.4 ? smoothstep(0.0,1.0,finalLum) : 1.0;

        vec4 outline = vec4(vec3(1.0 - finalLum), 1.0);
        
        //--- step color
        vec4 tex = texture(iChannel0, uv);
        vec4 color = vec4(stepColor(tex.rgb),1.0);
        
        vec3 res = min(outline.rgb, color.rgb);
        
        fragColor = vec4(res,1.0);
    }

    #elif MODE == 2
        const float PI = 3.1415926536;
        const float PI2 = PI * 2.0; 
        const int mSize = 9;
        const int kSize = (mSize-1)/2;
        const float sigma = 3.0;
        float kernel[mSize];

        // Gaussian PDF
        float normpdf(in float x, in float sigma) 
        {
            return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
        }

        // 
        vec3 colorDodge(in vec3 src, in vec3 dst)
        {
            return step(0.0, dst) * mix(min(vec3(1.0), dst/ (1.0 - src)), vec3(1.0), step(1.0, src)); 
        }

        float greyScale(in vec3 col) 
        {
            return dot(col, vec3(0.3, 0.59, 0.11));
            //return dot(col, vec3(0.2126, 0.7152, 0.0722)); //sRGB
        }

        vec2 random(vec2 p){
            p = fract(p * (vec2(314.159, 314.265)));
            p += dot(p, p.yx + 17.17);
            return fract((p.xx + p.yx) * p.xy);
        }

        vec2 random2(vec2 p)
        {
            return texture(iChannel1, p / vec2(1024.0)).xy;
            //blue1 = texture(iChannel1, p / vec2(1024.0));
            //blue2 = texture(iChannel1, (p+vec2(137.0, 189.0)) / vec2(1024.0));    
        }

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
            vec2 q = fragCoord.xy / iResolution.xy;
            q = uvmapping(q, fragCoord);
            vec3 col = texture(iChannel0, q).rgb;
        
            vec2 r = random(q);
            r.x *= PI2;
            vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y);
            
            vec3 blurred = texture(iChannel0, q + cr * (vec2(mSize) / iResolution.xy) ).rgb;
            
            vec3 inv = vec3(1.0) - blurred; 
            // color dodge
            vec3 lighten = colorDodge(col, inv);
            // grey scale
            vec3 res = vec3(greyScale(lighten));
            
            // more contrast
            res = vec3(pow(res.x, 3.0)); 
            //res = clamp(res * 0.7 + 0.3 * res * res * 1.2, 0.0, 1.0);
            
            fragColor = vec4(res, 1.0); 
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
            img.onerror = () => {
                alert("图片加载失败")
            }
            img.src = e.target.result
            imgDiv.src = e.target.result
            loading.style.display = 'none'
        }
        if (file.type.includes("video")) {
            video = document.createElement("video")
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