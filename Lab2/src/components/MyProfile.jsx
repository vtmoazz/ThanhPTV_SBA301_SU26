import Card from 'react-bootstrap/Card'

function MyProfile({ person }) {
  return (
    <Card className="profile-card">
      <div className="profile-image-wrap">
        <Card.Img className="profile-image" variant="top" src={person.image} alt={person.name} />
      </div>
      <Card.Body className="profile-body">
        <Card.Title className="profile-name">{person.name}</Card.Title>
        <Card.Text className="profile-info">
          Ma SV: {person.id}
          <br />
          Nganh: {person.major}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default MyProfile
