const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await base44.entities.StudySpot.create({
      name: form.name,
      location_area: form.location_area,
      description: form.description,
      status: "pending"
    });

    alert("Spot submitted successfully!");
  } catch (error) {
    alert("Failed to submit spot.");
  }
};