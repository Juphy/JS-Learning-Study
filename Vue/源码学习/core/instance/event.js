class EventEmitter {
  constructor() {
    this.events = Object.create(null)
  }

  on(event, fn){
    if(Array.isArray(event)){
      for(let i = 0, len = event.length; i < len; i++){
        this.on(event[i], fn)
      }
    }else{
      (this.events[event] || (this.events[event] = [])).push(fn)
    }
    return this
  }

  once(event, fn){
    function _on(){
      this.off(event, _on);
      fn.apply(this, arguments)
    }
    _on.fn = fn;
    this.on(event, _on);
    return this;
  }

  off(event, fn){
    if(!arguments.length){
      this.events = Object.create(null);
      return this;
    }

    if(Array.isArray(event)){
      for(let i = 0, len = event.length; i < len; i++){
        this.off(event[i], fn)
      }
      return this;
    }

    let cbs = this.events[event];
    if(!cbs){
      return this;
    }

    if(arguments.length === 1){
      this.events[event] = [];
      return this;
    }

    let cb, i = event.length;
    while(i--){
      cb = cbs[i];
      if(cb === fn || cb.fn === fn){
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }

  emit(event){
    let cbs = this.events[event];
    if(cbs){
      cbs = Array.prototype.slice.call(cbs);
      let args = Array.from(arguments).slice(1);
      for(let i = 0, len = cbs.length; i < len; i++){
        cbs[i].apply(this, args)
      }
    }
    return this;
  }
}
function toArray(list, start){
  start = start || 0;
  let i = list.length - start;
  let res = new Array(i);
  while(i--){
    res[i] = list[i+start]
  }
  return res;
}