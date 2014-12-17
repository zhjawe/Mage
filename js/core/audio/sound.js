Class("Sound", {

	Sound : function(name, options) {
		Beat.call(this, name);
		//creating panner, we need to update on object movements.
		this.sound.panner = AudioEngine.context.createPanner();
		//disconnecting from main volume, then connecting to panner and main volume again
		this.sound.volume.disconnect();
		this.sound.volume.connect(this.sound.panner);
		this.sound.panner.connect(AudioEngine.volume);

		//storing mesh
		this.mesh = options.mesh;

		if (options.effect) {

			this.convolver = AudioEngine.context.createConvolver();
			this.mixer = AudioEngine.createGain();
			this.sound.panner.disconnect();
			this.sound.panner.connect(this.mixer);
			//creating gains
			this.plainGain = AudioEngine.context.createGain();
			this.convolverGain = AudioEngine.context.createGain();
			//connect mixer to new gains
			this.mixer.connect(plainGain);
			this.mixer.connect(convolverGain);

			this.plainGain.connect(AudioEngine.volume);
			this.convolverGain.connect(AudioEngine.volume);

			this.convolver.buffer = AudioEngine.get(options.effect);
			this.convolverGain.gain.value = 0.7;
			this.plainGain.gain.value = 0.3;

		}
		//autoplay option
		var autoplay = options.autoplay || false;
		if (autoplay) {
			this.start();
		}
		//adding this sound to AudioEngine
		AudioEngine.add(this);
	},

	update : function(dt) {

		var p = new THREE.Vector3();
		p.setFromMatrixPosition(this.mesh.matrixWorld);
		var px = p.x, py = p.y, pz = p.z;

		this.mesh.updateMatrixWorld();

		var q = new THREE.Vector3();
		q.setFromMatrixPosition(this.mesh.matrixWorld);
		var dx = q.x-px, dy = q.y-py, dz = q.z-pz;
		//setting panner position and velocity using doppler effect.
		this.sound.panner.setPosition(q.x, q.y, q.z);
		this.sound.panner.setVelocity(dx/dt, dy/dt, dz/dt);

	}

})._extends("Beat");