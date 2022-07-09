class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width:window.innerWidth,
			height:window.innerHeight,
			backgroundColor:0x000000,
			resizeTo:window
		})
		console.log(this.app);
		document.querySelector(selector).appendChild(this.app.view)
		this.loader = new PIXI.Loader()
		this.stage = this.app.stage
		// 添加资源
		this.loader.add('btn.png',"images/btn.png");
		this.loader.add('btn_circle.png',"images/btn_circle.png");
		this.loader.add('brake_bike.png',"images/brake_bike.png");
		this.loader.add('brake_handlerbar.png',"images/brake_handlerbar.png");
		this.loader.add('brake_lever.png',"images/brake_lever.png");
		this.loader.add('line.jpg',"images/line.jpg");
		// 加载资源
		this.loader.load()
		// 添加监听器
		this.loader.onComplete.add(()=>{
			console.log('complete');
			this.show()
		})
	}

	show(){

		
		
		const bikeContainer = new PIXI.Container()
		const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
		const bikeHandlerImage = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
		const bikeLeverImage = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture)
		

		bikeContainer.addChild(bikeLeverImage)
		bikeContainer.addChild(bikeImage)
		bikeContainer.addChild(bikeHandlerImage)

		bikeLeverImage.pivot.x = bikeLeverImage.pivot.y = 455
		bikeLeverImage.x = 722
		bikeLeverImage.y = 900
		this.stage.addChild(bikeContainer)
		// 调整缩放比例
		bikeContainer.scale.x = bikeContainer.scale.y = 0.3

		const actionButton = this.createActionButton()
		// 调整容器的位置
		actionButton.x = 722 
		actionButton.y = 900
		bikeContainer.addChild(actionButton)

		// 添加交互
		actionButton.interactive = true
		actionButton.buttonMode = true

		actionButton.on('mousedown',()=>{
			gsap.to(bikeLeverImage,{duration:.6, rotation:Math.PI/180*-30})
			pause()
		})

		actionButton.on('mouseup',()=>{
			gsap.to(bikeLeverImage,{duration:.6, rotation:0})
			start()
		})

		// 监听窗口变动，把自行车固定在右下角
		let resize = ()=>{
			bikeContainer.x = window.innerWidth - bikeContainer.width
			bikeContainer.y = window.innerHeight - bikeContainer.height
		}
		window.addEventListener('resize',resize)
		resize()

		// 创建粒子容器
		const particleContainer = new PIXI.Container()
		this.stage.addChild(particleContainer)

		const lineImage = new PIXI.Sprite(this.loader.resources['line.jpg'].texture)
		lineImage.scale.x = lineImage.scale.y = 0.5
		lineImage.rotation = 90 * Math.PI / 180
		lineImage.x = 800
		// particleContainer.addChild(lineImage)
		// this.stage.appendChild(lineImage)
		particleContainer.addChild(lineImage)
		
		// 调整圆心和角度
		particleContainer.rotation = 35 * Math.PI /180
		particleContainer.pivot.x = window.innerWidth/2
		particleContainer.pivot.y = window.innerHeight/2
		particleContainer.x = window.innerWidth/2
		particleContainer.y = window.innerHeight/2
		// 创建粒子
		let particles = []
		const colors = [0xf1cf54,0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
		for(let i=0;i<10;i++){
			let gr = new PIXI.Graphics()
			gr.beginFill(colors[Math.floor(Math.random()*colors.length)])
			gr.drawCircle(0,0,6)
			gr.endFill()

			let pItem = {
				sx:Math.random()* window.innerWidth,
				sy:Math.random()* window.innerHeight,
				gr,
			}
			gr.x = pItem.sx
			gr.y = pItem.sy
			particleContainer.addChild(gr)
			particles.push(pItem)
		}
		let speed = 0
		function loop(){
			speed+=0.5
			speed = Math.min(speed,20)

			lineImage.y += speed
			if(lineImage.y>= window.innerHeight){
				lineImage.y = -lineImage.height
			}
			
			for(let i=0;i<particles.length;i++){
				let pItem = particles[i]
				pItem.gr.y +=speed
				if(speed>=20){
					pItem.gr.scale.y = 20
					pItem.gr.scale.x = 0.03
				}

				if(pItem.gr.y>=window.innerHeight){
					pItem.gr.y = 0
				}

			}
		}

		function start(){
			speed=0
			gsap.ticker.add(loop)
		}

		function pause(){
			gsap.ticker.remove(loop)
			// 粒子还原
			for(let i=0;i<particles.length;i++){
				let pItem = particles[i]
				pItem.gr.scale.x = pItem.gr.scale.y = 1
				gsap.to(pItem.gr, {duration:.6,x:pItem.sx, y:pItem.sy, ease:'elastic.out'})
			}
		}
		start()
		
		
	}

	createActionButton(){
		// 创建一个容器，可以统一调整容器内的元素
		let actionButton = new PIXI.Container()
		// actionButton.scale.x = actionButton.scale.y = .6
		// this.app.stage.addChild(actionButton)
		let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
		let btnCircle = new PIXI.Sprite(this.loader.resources["btn_circle.png"].texture);
		let btnCircle2 = new PIXI.Sprite(this.loader.resources["btn_circle.png"].texture);
		actionButton.addChild(btnImage)
		actionButton.addChild(btnCircle)
		actionButton.addChild(btnCircle2)
		// 改变轴心
		btnImage.pivot.x = btnImage.pivot.y = btnImage.width/2
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width/2
		btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width/2
		
		// 使用 GSAP 添加动效
		btnCircle.scale.x = btnCircle.scale.y = 0.8
		// 从当前的位置变换到下个位置
		gsap.to(btnCircle.scale,{duration:1, x:1.2, y:1.2, repeat:-1});
		gsap.to(btnCircle,{duration:1,alpha:0,repeat:-1})
		
		return actionButton
	}
}