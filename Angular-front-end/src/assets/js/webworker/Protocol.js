class Protocol {
    static code = {
        error: 0,
        success: 1,
        done: 2
    }

    static error(data) {
        if( !(data instanceof Error) ) {
            data = new Error(data);
        }
        return {
            code: Protocol.code.error,
            error: data
        };
    }

    static success(data) {
        return {
            code: Protocol.code.success,
            data: data
        };
    }

    static done() {
        return {
            code: Protocol.code.done,
            data: 'Close'
        };
    }
}