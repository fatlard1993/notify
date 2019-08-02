// includes dom log
// babel
/* global dom log */

var notify = function(className, message, timeout, force){
	if(className instanceof Object){
		force = className.force;
		timeout = className.timeout;
		message = className.message;
		className = className.className;
	}

	for(var x = 0; x < notify.que.length; ++x){
		if(message === notify.que[x][1]) return log.warn()('[notify] Notification already in que!');
	}

	if(notify.isOpen && (message === notify.active.textContent)) return log.warn()('[notify] Notification already being displayed!');

	if(notify.isOpen){
		notify.que.push([className, message, timeout]);

		if(force) notify.dismiss();

		return;
	}

	notify.isOpen = true;

	notify.active = notify.active || document.getElementById('notification') || dom.createElem('div', { id: 'notification', prependTo: document.body });

	if(!notify.offPointerUp){
		dom.onPointerUp(notify.active, function(evt){
			evt.stop();

			notify.dismiss();
		});
	}

	dom.animation.add('write', function notification_anim(){
		notify.active.className = 'discard left';
		notify.active.textContent = message;

		dom.show(notify.active, '', function(){
			notify.active.className = className;

			if(timeout) setTimeout(notify.dismiss, timeout * 1000);
		});
	});
};

notify.que = [];

notify.dismiss = function(){
	if(!notify.isOpen) return;

	dom.discard(notify.active, 'left', function(){
		notify.isOpen = false;

		if(notify.que.length) notify.apply(null, notify.que.shift());
	}, 200);
};

notify.err = function(message, timeout, force){
	notify('error', message, timeout || 0, force);
};

notify.warn = function(message, timeout, force){
	notify('warning', message, timeout || 2, force);
};

notify.tip = function(message, timeout, force){
	notify('tip', message, timeout || 2.4, force);
};

notify.success = function(message, timeout, force){
	notify('success', message, timeout || 2.4, force);
};

notify.info = function(message, timeout, force){
	notify('info', message, timeout || 2.4, force);
};

notify.clearAll = function(){
	notify.que = [];

	notify.dismiss();
};

dom.interact.on('keyUp', function(evt){
	if(evt.keyPressed === 'ESCAPE' && notify.isOpen){
		evt.preventDefault();

		notify[evt.ctrlKey ? 'clearAll' : 'dismiss']();
	}
});