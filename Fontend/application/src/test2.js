import React from 'react'
import {Link} from 'react-router-dom'

function Test2() {
    return (
        <div>
            Test2
            <Link to={"/test2"}>Test 2</Link>
            <Link to={"/test1"}>Test 1</Link>
        </div>
    )
}

export default Test2