// https://github.com/vuejs/vue/issues/6201
// http://hcysun.me/2018/01/05/%E6%8E%A2%E7%B4%A2Vue%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6/
// https://github.com/hwen/vue-hoc
/* eslint-disable */
import ElTableColumn from 'element-ui/lib/table-column';

// HOC for el-table-column
function createColPro(Col, options = { props: {} }) {
  function normalizeSlots(slots) {
    return (
      Object.keys(slots)
        .reduce((arr, key) => arr.concat(slots[key]), [])
        // 手动更正 context
        .map(vnode => {
          vnode.context = this._self;
          return vnode;
        })
    );
  }
  function createRenderFn(component, { attrs = {}, listeners = {}, props = {} } = {}) {
    // var props = props || {} // babel parse 之后，其实是一个闭包 props
    return function(h) {
      console.log('======= this.$props for ColPro ====');
      console.log(this.$props);
      console.log('======= this.$attrs for ColPro ====');
      console.log(this.$attrs);
      let { colConfig } = this.$attrs;
      // handle added props
      if (this.$props.hocAddedProp) {
        // Object.assign(this.$props, this.$props.hocAddedProp) // do not modify this.$props directly
        /**
         * 也不要这样写，props有闭包，所以会把前面的数据带到后面的col
         * 比方说，这里就把前面的 width，设置到 “地址” 的col，导致“地址”col宽度变成180
         * 而不是自动适应宽度
         */
        // Object.assign(props, this.$props.hocAddedProp)
        colConfig = { ...this.$props.hocAddedProp };
        console.log('======= extended props ====');
        console.log(props);
      }
      return h(
        component,
        {
          attrs: Object.assign({}, this.$attrs, attrs), // pass on attributes (anything not defined as a prop)
          on: Object.assign({}, this.$listeners, listeners), // pass on v-on event listeners
          props: Object.assign({}, this.$props, { ...props, ...colConfig }), // pass on props
          scopedSlots: this.$scopedSlots // pass on scoped slots
        },
        normalizeSlots(this.$slots)
      ); // pass on normal slots, ass an array
    };
  }
  // add props for origin el-table-columns
  function extendProps(props) {
    return Object.assign({}, props, { hocAddedProp: undefined });
  }

  const ColPro = {
    props: typeof Col === 'function' ? extendProps(Col.options.props) : extendProps(Col.props),
    created() {
      this.$createElement = this.$parent.$createElement;
    },
    render: createRenderFn(Col)
  };

  if (!options.mixins) options.mixins = [];
  options.mixins.push(ColPro);
  // create a component name
  options.name = 'ColPro';
  return options;
}

export default createColPro(ElTableColumn);
