import React from 'react'
import {Link} from 'react-router-dom'

function Test1() {
    return (
        <div>
            Test1
            <Link to={"/test2"}>Test 2</Link>
            <Link to={"/test1"}>Test 1</Link>
        </div>
    )
}

export default Test1