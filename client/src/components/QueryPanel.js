/**
 * Given an analytic engine URL, query for schema, allow user to enter query.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import DisplayPanel from './DisplayPanel'
import { getEngineSchema } from '../lib/analyticRestApi'
import SchemaTableDisplay from './SchemaTableDisplay'
import { codeFont } from './BaseStyles'

const DivTableLayout = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: top;
  margin-bottom: 10px;
`

const DivTablePadding = styled.div`
  &:nth-child(n + 2) {
    padding-left: 8px;
  }
`

// influenced by react bootstrap styling
const TextAreaSchema = styled.textarea`
  height: 8em;
  padding: 6px 12px;
  font-family: ${codeFont.fontFamily};
  font-size: ${codeFont.fontSize};
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075),
      0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075),
      0 0 8px rgba(102, 175, 233, .6);
  }
`

class QueryPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schema: [{ tableName: 'No tables retrieved', columns: {} }],
      friendlyName: '',
      query: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.getSchema = this.getSchema.bind(this)
  }

  componentDidMount() {
    if (
      this.props.engineURL !== undefined &&
      this.props.engineAPI !== undefined
    ) {
      this.getSchema(this.props.engineURL, this.props.engineAPI)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.engineURL !== undefined &&
      this.props.engineAPI !== undefined
    ) {
      this.getSchema(this.props.engineURL, this.props.engineAPI)
    }
  }

  getSchema(url, api) {
    getEngineSchema(this.props.engineURL, this.props.engineAPI)
      .then(json => {
        this.setState({ schema: json.schema, friendlyName: json.friendlyName })
      })
      .catch(ex => {
        console.log(ex)
      })
  }

  handleChange(event) {
    this.setState({ query: event.target.value })
    event.preventDefault()
    event.stopPropagation()
  }

  handleBlur(event) {
    this.props.storeQuery(event.target.value)
    event.preventDefault()
    event.stopPropagation()
  }

  render() {
    const analyticEngineName = url =>
      url !== undefined
        ? `Query for ${url.replace(/^https?:\/\//i, '')} (${this.state
            .friendlyName})`
        : 'Awaiting connection details...'

    const displaySchemaTables = schema => {
      return schema.map(table =>
        <DivTablePadding key={table.tableName}>
          <SchemaTableDisplay
            tableName={table.tableName}
            colNames={table.columns}
          />
        </DivTablePadding>
      )
    }

    return (
      <DisplayPanel heading={analyticEngineName(this.props.engineURL)}>
        <DivTableLayout>
          {displaySchemaTables(this.state.schema)}
        </DivTableLayout>
        <TextAreaSchema
          value={this.state.query}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          innerRef={textarea => {
            this.textArea = textarea
          }}
          placeholder="Enter SQL query ..."
        />
      </DisplayPanel>
    )
  }
}

QueryPanel.propTypes = {
  engineURL: PropTypes.string,
  engineAPI: PropTypes.string,
  storeQuery: PropTypes.func.isRequired
}

export default QueryPanel
