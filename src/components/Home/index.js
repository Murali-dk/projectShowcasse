import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const contentStaus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: 'INITIAL',
    selectValue: categoriesList[0].id,
    responseData: [],
  }

  componentDidMount() {
    this.getResult()
  }

  getResult = async () => {
    this.setState({apiStatus: contentStaus.inProgress})
    const {selectValue} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectValue}`
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateData = data.projects.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({responseData: updateData, apiStatus: contentStaus.success})
    } else {
      this.setState({apiStatus: contentStaus.failure})
    }
  }

  categoryChange = event => {
    this.setState({selectValue: event.target.value}, this.getResult)
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="blue" width={50} height={50} />
    </div>
  )

  renderProjects = () => {
    const {responseData} = this.state

    return (
      <ul className="card-cont">
        {responseData.map(eachItem => (
          <li key={eachItem.id} className="card">
            <img className="img" alt={eachItem.name} src={eachItem.imageUrl} />
            <p className="h1">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  retry = () => {
    this.getResult()
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.retry} type="button">
        Retry
      </button>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case contentStaus.inProgress:
        return this.renderLoader()
      case contentStaus.success:
        return this.renderProjects()
      case contentStaus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selectValue} = this.state
    return (
      <div className="bg-cont">
        <nav className="nav">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div className="bottom-cont">
          <select
            onChange={this.categoryChange}
            value={selectValue}
            className="input"
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

export default Home
