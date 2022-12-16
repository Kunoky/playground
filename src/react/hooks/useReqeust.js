import React, { useState, useEffect, useCallback } from "react";
import request from "";
import { debounce } from 'src/index'

/**
 * 通用接口请求逻辑处理
 *
 * @param {function} service 数据请求函数
 * @param {object} options {
 *  manual: boolean                           默认 false。 即在初始化时自动执行 service。如果设置为 true，则需要手动调用 run 触发执行
 *  initialData: any                          data默认值
 *  params: array                             当次执行的 service 的参数数组。比如你触发了 run(1, 2, 3)，则 params 等于 [1, 2, 3]
 *  refreshDeps: array                        在 manual = false 时，refreshDeps 变化，会使用之前的 params 重新执行 service
 *  onSuccess: function(data, params)         service resolve 时触发，参数为 data 和 params
 *  onError: function(e, params)              service 报错时触发，参数为 error 和 params
 *  onFinally: function()                     service 结束时触发
 *  injectRequest: boolean                    默认 true。即service的第一个参数注入为requset，如果设置false，则不注入
 *  debounceWait: number                      防抖延迟时间
 * }
 * @returns {object} {
 *  data: any               service 返回的数据，默认为 undefined
 *  error：Error            service 抛出的异常，默认为 undefined
 *  loading：boolean        service 是否正在执行
 *  run: function           使用上一次的 params，重新执行 service
 *  refresh: function       手动触发 service 执行，参数会传递给 service
 * }
 */
export default function useReqeust(service, options = {}) {
  const {
    manual = false,
    initialData,
    onSuccess,
    onError,
    onFinally,
    refreshDeps = [],
    injectRequest = true,
    debounceWait = 0,
  } = options;
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(void 0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState([]);
  useEffect(
    () => {
      if (!manual) {
        run(...params);
      }
    },
    [...refreshDeps]
  );
  const _run = async (...params) => {
    try {
      setLoading(true);
      setError(void 0);
      setParams(params);
      let p = [...params];
      if (injectRequest) {
        p.unshift(request);
      }
      const data = await service(...p);
      setData(data);
      onSuccess?.(data, params);
    } catch (e) {
      console.error(e);
      setError(e);
      onError?.(data, params);
    } finally {
      setLoading(false);
      onFinally?.(params);
    }
  };
  // debounceRun的作用域只有在debounceWait改变时才会更新
  // 注意：此时sevice不要试图依赖父作用域的变量
  const debounceRun = useCallback(debounce(_run, debounceWait), [debounceWait]);
  const run = debounceWait ? debounceRun : _run
  const refresh = () => {
    run(...params);
  };
  return {
    data,
    error,
    loading,
    params,
    run,
    refresh,
  };
}
