import Store from 'beedle';

let _data = [];
let _saveUrl;

export default new Store({  
    actions: {
        load(context, { loadData: urlOrData,  saveUrl }) {
            _saveUrl = saveUrl;
        
            if(typeof urlOrData == 'string' || urlOrData instanceof String) {
                $.ajax({
                    url: urlOrData,
                    success: function(data) {
                        _data = JSON.parse(data);
                        context.commit('setData', _data);
                    }
                })
            } else {
                _data = urlOrData;
                context.commit('setData', _data);
            }
        },
        
        create(context, element) {
            _data.push(element);
            context.commit('setData', _data);
            this.save();
        },
        
        delete(context, element) {
            var index = _data.indexOf(element);
            _data.splice(index, 1);
            context.commit('setData', _data);
            this.save();
        },
        
        updateOrder(context, elements) {
            _data = elements;
            context.commit('setData', _data);
            this.save();
        },
        
        save(context) {
            if (_saveUrl) {
                $.ajax({
                    type: 'POST',
                        url: _saveUrl,
                        data: {
                        task_data: JSON.stringify(_data)
                    },
                    dataType: 'json',
                        success: function(data) {
                        console.log('Saved... ', arguments);
                    }
                })
            }
        },
    },

    mutations: {
        setData(state, payload) {
            state.data = payload;
            return state;
        }
    },

    initialState: {
        data: []
    }
});