const mapErrorCustom = new Map()
type ErrorType = 'nativeError'
class ErrorCustom {
  constructor(
    public type: ErrorType,
    public message: string,
  ) {
    this.type = type
    this.message = message
  }

  getErrorMessage(): string {
    return this.message
  }

  getErrorType(): ErrorType {
    return this.type
  }
}

export const isErrorCustom = (errorMessage: string): boolean => {
  return mapErrorCustom.get(errorMessage)
}

export const getErrorCustom = (errorMessage: string): ErrorCustom => {
  return mapErrorCustom.get(errorMessage)
}

export const setErrorCustom = (type: ErrorType, message: string): Error => {
  try {
    const mapKey = `${type}:${message}`
    mapErrorCustom.set(mapKey, new ErrorCustom(type, message))
    return new Error(mapKey)
  } catch (error) {
    console.log('setErrorCustom error', error)
    throw error
  }
}
