import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './ListPage.less';
import { listSelector } from '../models/item/selectors';
import ItemList from '../components/ItemList';
import Layout from '../components/Layout';

function ListPage({ loading, items, page, maxPage, activeType, location }) {
  // 额。。。把 styles 也解析成 JavaScript Object 所以就可以 styles.xx 这么用
  return (
    <Layout>
      <div className={styles.normal}>
        <ItemList
          loading={loading}
          items={items}
          page={page}
          maxPage={maxPage}
          activeType={activeType}
          location={location}
        />
      </div>
    </Layout>
  );
}

ListPage.propTypes = {
};

// ownProps 就是该组件所接收的 props
function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.global,
    ...listSelector(state, ownProps),
  };
}

// connect 既是 require('react-redux').connect
export default connect(mapStateToProps)(ListPage);
