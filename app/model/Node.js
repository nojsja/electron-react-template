const DataSet = require('./DataSet');
const nodeSchema = require('./schema/node.schema');
const api = require('../utils/api.js');
const { ipRequestEncoded, ipRequest } = require('../utils/request');
const ping = require("ping");

class Node extends DataSet {
  constructor() {
    super('nodes', nodeSchema);
  }

  /**
    * getDefaultNode [获取当前默认节点]
    */
  listNodes() {
    return new Promise((resolve, reject) => {
      const nodes = this.get('node');
      resolve({
        code: 200,
        result: nodes
      });
    });
  }

  /**
    * getDefaultNode [获取当前默认节点]
    */
  getDefaultNode() {
    return new Promise((resolve, reject) => {
      const nodes = this.get('node');
      let isFound = false;
      let host = '';
      nodes.forEach((node) => {
        if (node.defaulted) {
          host = node.host
          isFound = true;
        };
      });
      if (isFound) {
        resolve({
          code: 200,
          result: host
        });
      } else {
        reject({
          code: 404,
        });
      }
    });
  }

  /**
    * addNode [添加节点信息]
    * @param  {[Object]} node [节点信息]
    */
  addNode({ host }) {
    return new Promise((resolve, reject) => {
      ping.sys.probe(host, (isAlive) => {
        if (!isAlive) {
          return reject({
            code: 404,
          });
        }
        this.update('node', { host }, { host }).then(() => {
          resolve({
            code: 200,
            result: host
          });
        })
      })
    })
  }

  /**
    * removeNode [移除一个节点]
    * @param  {[String]} host [节点IP]
    */
  removeNode({ host }) {
    return new Promise((resolve, reject) => {
      this.remove('node', { host }).then((result) => {
        resolve({
          code: 200,
          result
        });
      }, (err) => {
        reject(err);
      });
    })
  }

  /**
    * setNode [设置节点信息]
    * @param  {[String]} host [节点IP]
    * @param  {[Boolean]} defaulted [是否为默认节点]
    */
  setDefaultNode({ host }) {
    return new Promise((resolve, reject) => {
      this.update('node', { defaulted: true }, { defaulted: false }).then(() => {
        this.update('node', { host }, { host, defaulted: true }).then((result) => {
          resolve({
            code: 200,
            result: host
          });
        }, (err) => {
          reject(err);
        });
      })
    });
  }
}

module.exports = Node;