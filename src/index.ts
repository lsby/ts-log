import debugGen from 'debug'

export class Log {
  private static instance: Log | null = null

  public static async init(name: string): Promise<void> {
    if (!Log.instance) Log.instance = new Log(name)
  }

  public static getInstance(): Log {
    if (!Log.instance) throw new Error('该模块没有初始化')
    return Log.instance
  }

  private debugObj: debugGen.Debugger
  private _info: debugGen.Debugger
  private _debug: debugGen.Debugger
  private _err: debugGen.Debugger

  private constructor(private name: string) {
    this.debugObj = debugGen(name)
    this._info = this.debugObj.extend('info')
    this._debug = this.debugObj.extend('debug')
    this._err = this.debugObj.extend('err')
  }

  extend(name: string): Log {
    return new Log(`${this.name}:${name}`)
  }

  async info(formatter: unknown, ...args: unknown[]): Promise<void> {
    this._info(formatter, ...args)
  }

  async debug(formatter: unknown, ...args: unknown[]): Promise<void> {
    this._debug(formatter, ...args)
  }

  async err(formatter: unknown, ...args: unknown[]): Promise<void> {
    this._err(formatter, ...args)
  }
}
