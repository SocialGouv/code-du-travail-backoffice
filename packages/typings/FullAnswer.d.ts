declare namespace FullAnswer {
  interface Answer extends Answer.Answer {
    agreement_idcc: string;
    agreement_name: string;
    question_index: string;
    question_value: string;
  }

  interface WithReferences extends FullAnswer.Answer {
    references: Answer.Reference[];
  }
}
