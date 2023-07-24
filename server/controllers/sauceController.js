function getSauces(req, res) {
  console.log('my salsa!');
  res.status(200).send({message: 'mi salsa!'})
}

module.exports = {
  getSauces
}
