import { format } from 'util'
import debug from 'debug'

/**
 * Log 类用于在不同日志级别输出日志消息。
 * 该类允许你以结构化且灵活的方式记录日志，并根据需要扩展命名空间。
 */
export class Log {
  private debugObj: debug.Debugger
  private redirectCallbacks: Array<
    (level: 'trace' | 'debug' | 'info' | 'warn' | 'error', content: string, namespace: string) => void
  > = []
  private pipeCallbacks: Array<
    (level: 'trace' | 'debug' | 'info' | 'warn' | 'error', content: string, namespace: string) => void
  > = []
  private _info: debug.Debugger
  private _debug: debug.Debugger
  private _error: debug.Debugger
  private _warn: debug.Debugger
  private _trace: debug.Debugger

  /**
   * 创建一个 Log 类的实例。
   * 初始化日志对象，包含不同的日志级别：info、debug、error、warn、trace。
   *
   * 顺序: **`trace` < `debug` < `info` < `warn` < `error`**
   * @param {string} namespace - 日志命名空间的名称（用于日志前缀）。
   */
  constructor(private namespace: string) {
    this.debugObj = debug(this.namespace)
    this._trace = this.debugObj.extend('trace')
    this._debug = this.debugObj.extend('debug')
    this._info = this.debugObj.extend('info')
    this._warn = this.debugObj.extend('warn')
    this._error = this.debugObj.extend('error')
  }

  /**
   * 扩展当前日志对象，创建一个新的命名空间。
   * 这对于在应用程序的不同部分或模块中使用独立日志非常有用。
   * @param {string} namespace - 要扩展的新命名空间。
   * @returns {Log} 返回一个具有扩展命名空间的新 Log 实例。
   */
  extend(namespace: string): Log {
    let log = new Log(`${this.namespace}:${namespace}`)
    log.redirectCallbacks = [...this.redirectCallbacks]
    log.pipeCallbacks = [...this.pipeCallbacks]
    return log
  }

  /**
   * 重定向日志输出到自定义函数。
   * @param callback - 回调函数，接收日志级别、内容和命名空间。
   */
  redirect(
    callback: (level: 'trace' | 'debug' | 'info' | 'warn' | 'error', namespace: string, content: string) => void,
  ): this {
    this.redirectCallbacks.push(callback)
    return this
  }

  /**
   * 管道日志输出，先输出到控制台，再发送给自定义函数。
   * @param callback - 回调函数，接收日志级别、内容和命名空间。
   */
  pipe(
    callback: (level: 'trace' | 'debug' | 'info' | 'warn' | 'error', namespace: string, content: string) => void,
  ): this {
    this.pipeCallbacks.push(callback)
    return this
  }

  /**
   * 记录 trace 级别的日志消息。
   * 用于记录详细的跟踪信息，如函数调用或特定的业务逻辑步骤。
   */
  trace(formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback('trace', this.namespace, content)
      }
      return
    }
    this._trace(formatter, ...args)
    for (let callback of this.pipeCallbacks) {
      const content = format(formatter, ...args)
      callback('trace', this.namespace, content)
    }
  }

  /**
   * 记录 debug 级别的日志消息。
   * 用于开发过程中记录详细的调试信息。
   */
  debug(formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback('debug', this.namespace, content)
      }
      return
    }
    this._debug(formatter, ...args)
    for (let callback of this.pipeCallbacks) {
      const content = format(formatter, ...args)
      callback('debug', this.namespace, content)
    }
  }

  /**
   * 记录 info 级别的日志消息。
   * 用于记录应用程序的一般信息。
   */
  info(formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback('info', this.namespace, content)
      }
      return
    }
    this._info(formatter, ...args)
    for (let callback of this.pipeCallbacks) {
      const content = format(formatter, ...args)
      callback('info', this.namespace, content)
    }
  }

  /**
   * 记录 warn 级别的日志消息。
   * 用于记录潜在问题或警告，这些问题不会立即影响应用程序运行，但需要注意。
   */
  warn(formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback('warn', this.namespace, content)
      }
      return
    }
    this._warn(formatter, ...args)
    for (let callback of this.pipeCallbacks) {
      const content = format(formatter, ...args)
      callback('warn', this.namespace, content)
    }
  }

  /**
   * 记录 error 级别的日志消息。
   * 用于记录需要立即关注的错误或异常。
   */
  error(formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback('error', this.namespace, content)
      }
      return
    }
    this._error(formatter, ...args)
    for (let callback of this.pipeCallbacks) {
      const content = format(formatter, ...args)
      callback('error', this.namespace, content)
    }
  }

  /**
   * 根据指定的日志级别记录日志消息。
   * 这个方法允许你动态选择要使用的日志级别（`trace` < `debug` < `info` < `warn` < `error`）。
   */
  log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', formatter: unknown, ...args: unknown[]): void {
    if (this.redirectCallbacks.length > 0) {
      const content = format(formatter, ...args)
      for (let callback of this.redirectCallbacks) {
        callback(level, this.namespace, content)
      }
      return
    }
    switch (level) {
      case 'trace':
        this.trace(formatter, ...args)
        break
      case 'debug':
        this.debug(formatter, ...args)
        break
      case 'info':
        this.info(formatter, ...args)
        break
      case 'warn':
        this.warn(formatter, ...args)
        break
      case 'error':
        this.error(formatter, ...args)
        break
    }
  }
}
